import { fork, join, put } from 'redux-saga/effects';

import { ConfigSchema, DataDirectory, EVMLC } from 'evm-lite-lib';

import { configurationReadWorker } from './Configuration';
import { keystoreListWorker } from './Keystore';

import Configuration from '../../actions/Configuration';
import Keystore from '../../actions/Keystore';
import Application, { AppConnectivityPayLoad } from '../../actions/Application';


interface DirectoryChangeInitAction {
	type: string;
	payload: string;
}

interface ConnectivityCheckInitAction {
	type: string;
	payload: AppConnectivityPayLoad;
}

const app = new Application();
const config = new Configuration();
const keystore = new Keystore();

export function* dataDirectoryChangeWorker(action: DirectoryChangeInitAction) {
	const { success, failure } = app.handlers.directory;

	try {
		const directory = yield new DataDirectory(action.payload);


		const configurationForkData: ConfigSchema = yield join(
			yield fork(configurationReadWorker, config.handlers.load.init({
				directory: directory.path,
				name: 'config.toml'
			}))
		);


		yield put(success('Data Directory change successful.'));

		if (configurationForkData) {
			const list = configurationForkData.storage.keystore.split('/');
			const popped = list.pop();

			if (popped === '/') {
				list.pop();
			}

			const keystoreParentDir = list.join('/');

			yield join(
				yield fork(keystoreListWorker, keystore.handlers.list.init({
					directory: keystoreParentDir,
					name: 'keystore'
				}))
			);
		}
	} catch (e) {
		yield put(failure('Error: ' + e));
	}
}

export function* checkConnectivityWorker(action: ConnectivityCheckInitAction) {
	const { success, failure } = app.handlers.connectivity;

	try {
		const connection: EVMLC = new EVMLC(action.payload.host, action.payload.port, {
			from: '',
			gas: 0,
			gasPrice: 0
		});

		const result: boolean = yield connection.testConnection();

		if (result) {
			yield put(success('A connection to a node was established.'));
			// yield put(reset());

			return connection;
		}
	} catch (e) {
		yield put(failure('Error: ' + e));
		// yield put(reset());

		return null;
	}

}




