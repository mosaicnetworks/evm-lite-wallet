import { fork, join, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { Config, ConfigSchema } from 'evm-lite-lib';

import { accountsFetchAllWorker } from './Accounts';
import { BaseAction } from '../../common/ActionSet';

import ConfigurationActions, {
	ConfigLoadPayLoad,
	ConfigSavePayLoad
} from '../../actions/Config';
import AccountsActions from '../../actions/Accounts';

const config = new ConfigurationActions();
const accounts = new AccountsActions();

export function* configurationReadWorker(
	action: BaseAction<ConfigLoadPayLoad>
) {
	const { success, failure } = config.actionStates.load.handlers;

	try {
		const evmlConfig: Config = new Config(action.payload.path);
		const data: ConfigSchema = yield evmlConfig.load();

		if (data) {
			yield join(
				yield fork(
					accountsFetchAllWorker,
					accounts.actionStates.fetchAll.handlers.init({
						keystoreDirectory: data.storage.keystore
					})
				)
			);
		}

		yield put(success(data));

		return data;
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));

		return null;
	}
}

export function* configurationSaveWorker(
	action: BaseAction<ConfigSavePayLoad>
) {
	const { success, failure, reset } = config.actionStates.save.handlers;

	yield delay(1000);

	try {
		const evmlConfig: Config = new Config(action.payload.path);
		const response: string = yield evmlConfig.save(
			action.payload.configSchema
		);

		const configurationData: ConfigSchema = yield join(
			yield fork(
				configurationReadWorker,
				config.actionStates.load.handlers.init({
					path: action.payload.path
				})
			)
		);

		if (configurationData) {
			yield join(
				yield fork(
					accountsFetchAllWorker,
					accounts.actionStates.fetchAll.handlers.init({
						keystoreDirectory: configurationData.storage.keystore
					})
				)
			);
		}

		yield put(success(response));
		yield put(reset());

		return true;
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
		yield put(reset());

		return null;
	}
}
