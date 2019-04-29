import { all, takeLatest } from 'redux-saga/effects';

import { accountsFetchAllWorker } from '../workers/Accounts';

import AccountsActions from '../../actions/Accounts';

const accounts = new AccountsActions();

function* accountsFetchAllWatcher() {
	yield takeLatest(accounts.actions.fetchAll.init, accountsFetchAllWorker);
}

export default function*() {
	yield all([accountsFetchAllWatcher()]);
}
