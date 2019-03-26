import { all, takeLatest } from 'redux-saga/effects';

import { contractLoadWorker } from '../workers/Contract';

import Contract from '../../actions/Contract';

const contract = new Contract();

function* contractLoadWatcher() {
	yield takeLatest(contract.actions.load.init, contractLoadWorker);
}

export default function*() {
	yield all([
		// contractExecuteMethodWatcher(),
		// contractExecuteConstantMethodWatcher(),
		contractLoadWatcher()
	]);
}
