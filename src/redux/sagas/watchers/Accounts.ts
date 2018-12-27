import { all, takeLatest } from 'redux-saga/effects';

import { accountsDecryptWorker } from '../workers/Accounts';

import Accounts from '../../actions/Accounts';


const accounts = new Accounts();

function* accountsDecryptInitWatcher() {
	yield takeLatest(accounts.actions.decrypt.init, accountsDecryptWorker);
}

export default function* () {
	yield all([accountsDecryptInitWatcher()]);
}

