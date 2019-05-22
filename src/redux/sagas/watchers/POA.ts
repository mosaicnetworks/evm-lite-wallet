import { all, takeLatest } from 'redux-saga/effects';

import { poaWhiteListWorker } from '../workers/POA';

import POAActions from '../../actions/POA';

const poa = new POAActions();

function* poaWhiteListWatcher() {
	yield takeLatest(poa.actionStates.whiteList.init, poaWhiteListWorker);
}

export default function*() {
	yield all([poaWhiteListWatcher()]);
}
