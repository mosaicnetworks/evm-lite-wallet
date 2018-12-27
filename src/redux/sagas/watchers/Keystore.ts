import { all, takeLatest } from 'redux-saga/effects';

import { keystoreListWorker, keystoreUpdateWorker } from '../workers/Keystore';

import Keystore from '../../actions/Keystore';


const keystore = new Keystore();

function* keystoreListInitWatcher() {
	yield takeLatest(keystore.actions.list.init, keystoreListWorker);
}

function* keystoreUpdateInitWatcher() {
	yield takeLatest(keystore.actions.update.init, keystoreUpdateWorker);
}

export default function* () {
	yield all([keystoreListInitWatcher(), keystoreUpdateInitWatcher()]);
}



