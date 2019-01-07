import { all, takeLatest } from 'redux-saga/effects';

import { accountsDecryptWorker, accountsTransferWorker } from '../workers/Accounts';

import Accounts from '../../actions/Accounts';


const accounts = new Accounts();

function* accountsDecryptInitWatcher() {
	yield takeLatest(accounts.actions.decrypt.init, accountsDecryptWorker);
}

function* accountsTransferInitWatcher() {
	yield takeLatest(accounts.actions.transfer.init, accountsTransferWorker);
}

export default function* () {
	yield all([accountsDecryptInitWatcher(), accountsTransferInitWatcher()]);
}

