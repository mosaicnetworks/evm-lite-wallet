import * as path from 'path';

import { fork, join, put } from 'redux-saga/effects';

import { ConfigSchema, DataDirectory } from 'evm-lite-lib';

import { BaseAction } from '../../common/ActionSet';

import { configurationReadWorker } from './Config';
import { accountsFetchAllWorker } from './Accounts';

import ConfigurationActions from '../../actions/Config';
import AccountsActions from '../../actions/Accounts';
import DataDirectoryAction from '../../actions/DataDirectory';

const directoryActions = new DataDirectoryAction();
const configActions = new ConfigurationActions();
const accountsActions = new AccountsActions();

export function* dataDirectorySetWorker(action: BaseAction<string>) {
	const {
		success,
		failure
	} = directoryActions.actionStates.setDirectory.handlers;

	try {
		const directory = yield new DataDirectory(action.payload);

		const configurationForkData: ConfigSchema = yield join(
			yield fork(
				configurationReadWorker,
				configActions.actionStates.load.handlers.init({
					path: path.join(directory.path, 'config.toml')
				})
			)
		);

		yield put(success(action.payload));

		if (configurationForkData) {
			yield join(
				yield fork(
					accountsFetchAllWorker,
					accountsActions.actionStates.fetchAll.handlers.init({
						keystoreDirectory:
							configurationForkData.storage.keystore
					})
				)
			);
		}
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}
