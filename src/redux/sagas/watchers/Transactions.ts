import { all, takeLatest } from 'redux-saga/effects';

import { transactionHistoryWorker } from '../workers/Transactions';

import Transactions from '../../actions/Transactions';


const transactions = new Transactions();

function* transactionHistoryInitWatcher() {
	yield takeLatest(transactions.actions.history.init, transactionHistoryWorker);
}

export default function* () {
	yield all([transactionHistoryInitWatcher()]);
}

