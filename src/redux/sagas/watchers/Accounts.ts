import { all, takeLatest } from 'redux-saga/effects';

import {
	accountsFetchAllWorker,
	accountsFetchOneWorker,
	accountsCreateWorker
} from '../workers/Accounts';

import AccountsActions from '../../actions/Accounts';

const accounts = new AccountsActions();

function* accountsFetchAllWatcher() {
	yield takeLatest(
		accounts.actionStates.fetchAll.init,
		accountsFetchAllWorker
	);
}

function* accountsFetchOneWatcher() {
	yield takeLatest(
		accounts.actionStates.fetchOne.init,
		accountsFetchOneWorker
	);
}

function* accountsCreateWatcher() {
	yield takeLatest(accounts.actionStates.create.init, accountsCreateWorker);
}

export default function*() {
	yield all([
		accountsFetchAllWatcher(),
		accountsFetchOneWatcher(),
		accountsCreateWatcher()
	]);
}
