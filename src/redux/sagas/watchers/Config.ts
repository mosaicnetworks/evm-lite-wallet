import { all, takeLatest } from 'redux-saga/effects';

import {
	configurationReadWorker,
	configurationSaveWorker
} from '../workers/Config';

import ConfigurationActions from '../../actions/Config';

const config = new ConfigurationActions();

function* configurationReadInitWatcher() {
	yield takeLatest(config.actions.load.init, configurationReadWorker);
}

function* configurationSaveInitWatcher() {
	yield takeLatest(config.actions.save.init, configurationSaveWorker);
}

export default function*() {
	yield all([configurationReadInitWatcher(), configurationSaveInitWatcher()]);
}
