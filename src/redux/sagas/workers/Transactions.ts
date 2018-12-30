import { put, select } from 'redux-saga/effects';

import { Database } from 'evm-lite-lib';

import TransactionFilter from 'evm-lite-lib/tools/database/filters/Transaction';

import { Store } from '../..';

import Transactions, { AccountTransactionHistory, TransactionHistoryPayload } from '../../actions/Transactions';


interface TransactionHistoryAction {
	type: string;
	payload: TransactionHistoryPayload;
}

const transactions = new Transactions();

export function* transactionHistoryWorker(action: TransactionHistoryAction) {
	const { success, failure } = transactions.handlers.history;

	try {
		const state: Store = yield select();

		if (state.app.directory.response && state.app.directory.payload) {
			const database: Database = new Database(state.app.directory.payload, 'db.json');
			const filter: TransactionFilter = yield database.transactions.filter();
			const history: AccountTransactionHistory = {};

			action.payload.addresses.forEach(address => {
				history[address] = filter.sender(address);
			});

			yield put(success(history));
		} else {
			yield put(failure('Looks like no data directory was initialized.'));
		}
	} catch (e) {
		yield put(failure('Error: ' + e));
	}
}
