import { fork, join, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { Config, ConfigSchema } from 'evm-lite-lib';

import { keystoreListWorker } from './Keystore';

import Configuration, {
	ConfigLoadPayLoad,
	ConfigSavePayLoad
} from '../../actions/Configuration';
import Keystore from '../../actions/Keystore';

interface ConfigFileLoadAction {
	type: string;
	payload: ConfigLoadPayLoad;
}

interface ConfigFileSaveAction {
	type: string;
	payload: ConfigSavePayLoad;
}

const config = new Configuration();
const keystore = new Keystore();

export function* configurationReadWorker(action: ConfigFileLoadAction) {
	const { success, failure } = config.handlers.load;

	try {
		const evmlConfig: Config = new Config(
			action.payload.directory,
			action.payload.name
		);
		const data: ConfigSchema = yield evmlConfig.load();

		yield put(success(data));

		return data;
	} catch (e) {
		yield put(failure('Error: ' + e));

		return null;
	}
}

export function* configurationSaveWorker(action: ConfigFileSaveAction) {
	const { success, failure, reset } = config.handlers.save;

	yield delay(1000);

	try {
		const evmlConfig: Config = new Config(
			action.payload.directory,
			action.payload.name
		);

		console.log(evmlConfig);
		const response: string = yield evmlConfig.save(
			action.payload.configSchema
		);

		console.log(response);
		const configurationData: ConfigSchema = yield join(
			yield fork(
				configurationReadWorker,
				config.handlers.load.init({
					directory: action.payload.directory,
					name: action.payload.name
				})
			)
		);

		console.log(configurationData);

		if (configurationData) {
			const list = configurationData.storage.keystore.split('/');
			let popped = list.pop();

			if (popped === '/') {
				popped = list.pop();
			}

			const keystoreParentDir = list.join('/');

			yield join(
				yield fork(
					keystoreListWorker,
					keystore.handlers.list.init({
						directory: keystoreParentDir,
						name: popped!
					})
				)
			);
		}

		yield put(success(response));
		yield put(reset());

		return true;
	} catch (e) {
		yield put(failure('Error: ' + e));
		yield put(reset());

		return null;
	}
}
