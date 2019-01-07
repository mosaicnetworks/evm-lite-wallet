import { all, takeLatest } from 'redux-saga/effects';

import { keystoreCreateWorker, keystoreListWorker, keystoreUpdateWorker } from '../workers/Keystore';

import Keystore from '../../actions/Keystore';


const keystore = new Keystore();

function* keystoreListInitWatcher() {
	yield takeLatest(keystore.actions.list.init, keystoreListWorker);
}

function* keystoreUpdateInitWatcher() {
	yield takeLatest(keystore.actions.update.init, keystoreUpdateWorker);
}

function* keystoreCreateInitWatcher() {
	yield takeLatest(keystore.actions.create.init, keystoreCreateWorker);
}

export default function* () {
	yield all([keystoreListInitWatcher(), keystoreUpdateInitWatcher(), keystoreCreateInitWatcher()]);
}



