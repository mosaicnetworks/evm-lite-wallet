import {all, put, select, takeLatest} from "redux-saga/effects";

import {Database} from "evm-lite-lib";
import TransactionFilter from 'evm-lite-lib/tools/database/filters/Transaction';

import {Store} from "..";

import Transactions, {AccountTransactionHistory, TransactionHistoryPayload} from '../actions/Transactions';


interface TransactionHistoryAction {
    type: string;
    payload: TransactionHistoryPayload;
}

const transactions = new Transactions();

function* transactionHistoryInitWatcher() {
    yield takeLatest(transactions.actions.history.init, transactionHistoryWorker);
}

function* transactionHistoryWorker(action: TransactionHistoryAction) {
    try {
        const state: Store = yield select();

        if (state.app.directory.response && state.app.directory.payload) {
            const database: Database = yield new Database(state.app.directory.payload, 'db.json');
            const filter: TransactionFilter = yield database.transactions.filter();

            const history: AccountTransactionHistory = {};

            action.payload.addresses.forEach(address => {
                history[address] = filter.sender(address);
            });

            yield put(transactions.handlers.history.success(history));
        } else {
            yield put(transactions.handlers.history.failure('Looks like no data directory was initialized.'));
        }
    } catch (e) {
        yield put(transactions.handlers.history.failure('Something went wrong fetching transaction history.'));
    }
}

export default function* transactionSaga() {
    yield all([transactionHistoryInitWatcher()])
}

