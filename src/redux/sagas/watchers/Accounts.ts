import { all, takeLatest } from 'redux-saga/effects';

import {
	accountsFetchAllWorker,
	accountsFetchOneWorker,
	accountsCreateWorker,
	accountsUnlockWorker
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

function* accountsUnlockWatcher() {
	yield takeLatest(accounts.actionStates.unlock.init, accountsUnlockWorker);
}

function* accountsCreateWatcher() {
	yield takeLatest(accounts.actionStates.create.init, accountsCreateWorker);
}

export default function*() {
	yield all([
		accountsFetchAllWatcher(),
		accountsFetchOneWatcher(),
		accountsCreateWatcher(),
		accountsUnlockWatcher()
	]);
}
