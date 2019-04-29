import { fork, join, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { Config, ConfigSchema } from 'evm-lite-lib';

import { accountsFetchAllWorker } from './Accounts';

import ConfigurationActions, {
	ConfigLoadPayLoad,
	ConfigSavePayLoad
} from '../../actions/Config';
import AccountsActions from '../../actions/Accounts';

interface ConfigFileLoadAction {
	type: string;
	payload: ConfigLoadPayLoad;
}

interface ConfigFileSaveAction {
	type: string;
	payload: ConfigSavePayLoad;
}

const config = new ConfigurationActions();
const accounts = new AccountsActions();

export function* configurationReadWorker(action: ConfigFileLoadAction) {
	const { success, failure } = config.handlers.load;

	try {
		const evmlConfig: Config = new Config(action.payload.path);
		const data: ConfigSchema = yield evmlConfig.load();

		yield put(success(data));

		return data;
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));

		return null;
	}
}

export function* configurationSaveWorker(action: ConfigFileSaveAction) {
	const { success, failure, reset } = config.handlers.save;

	yield delay(1000);

	try {
		const evmlConfig: Config = new Config(action.payload.path);
		const response: string = yield evmlConfig.save(
			action.payload.configSchema
		);

		const configurationData: ConfigSchema = yield join(
			yield fork(
				configurationReadWorker,
				config.handlers.load.init({
					path: action.payload.path
				})
			)
		);

		if (configurationData) {
			yield join(
				yield fork(
					accountsFetchAllWorker,
					accounts.handlers.fetchAll.init({
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
