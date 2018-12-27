import { all, takeLatest } from 'redux-saga/effects';

import { checkConnectivityWorker, dataDirectoryChangeWorker } from '../workers/Application';

import Application from '../../actions/Application';


const app = new Application();

function* dataDirectoryChangeInitWatcher() {
	yield takeLatest(app.actions.directory.init, dataDirectoryChangeWorker);
}

function* checkConnectivityInitWatcher() {
	yield takeLatest(app.actions.connectivity.init, checkConnectivityWorker);
}

export default function* () {
	yield all([checkConnectivityInitWatcher(), dataDirectoryChangeInitWatcher()]);
}




