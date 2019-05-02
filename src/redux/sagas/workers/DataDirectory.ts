import * as path from 'path';

import { fork, join, put } from 'redux-saga/effects';

import { DataDirectory } from 'evm-lite-lib';

import { BaseAction } from '../../common/AsyncActionSet';

import { configurationReadWorker } from './Config';

import ConfigurationActions from '../../actions/Config';
import DataDirectoryAction from '../../actions/DataDirectory';

const directoryActions = new DataDirectoryAction();
const configActions = new ConfigurationActions();

export function* dataDirectorySetWorker(action: BaseAction<string>) {
	const {
		success,
		failure
	} = directoryActions.actionStates.setDirectory.handlers;

	try {
		const directory = yield new DataDirectory(action.payload);

		yield put(success(action.payload));
		yield join(
			yield fork(
				configurationReadWorker,
				configActions.actionStates.load.handlers.init({
					path: path.join(directory.path, 'config.toml')
				})
			)
		);
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}
