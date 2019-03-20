import { all, takeLatest } from 'redux-saga/effects';

import { keystoreCreateWorker } from '../workers/Keystore';

import Contract from '../../actions/Contract';

const contract = new Contract();

function* contractExecuteMethodWatcher() {
	yield takeLatest(contract.actions.executeMethod.init, keystoreCreateWorker);
}

function* contractExecuteConstantMethodWatcher() {
	yield takeLatest(
		contract.actions.executeConstantMethod.init,
		keystoreCreateWorker
	);
}

export default function*() {
	yield all([
		contractExecuteMethodWatcher(),
		contractExecuteConstantMethodWatcher()
	]);
}
