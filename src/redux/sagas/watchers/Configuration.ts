import { all, takeLatest } from 'redux-saga/effects';

import { configurationReadWorker, configurationSaveWorker } from '../workers/Configuration';

import Configuration from '../../actions/Configuration';


const config = new Configuration();

function* configurationReadInitWatcher() {
	yield takeLatest(config.actions.load.init, configurationReadWorker);
}

function* configurationSaveInitWatcher() {
	yield takeLatest(config.actions.save.init, configurationSaveWorker);
}

export default function* () {
	yield all([configurationReadInitWatcher(), configurationSaveInitWatcher()]);
}
