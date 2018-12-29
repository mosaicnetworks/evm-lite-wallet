import { fork, join, put, select } from 'redux-saga/effects';

import { Account, Keystore } from 'evm-lite-lib';

import { Store } from '../..';

import Accounts, { AccountsDecryptPayload, AccountsTransferPayLoad } from '../../actions/Accounts';


interface AccountsDecryptAction {
	type: string;
	payload: AccountsDecryptPayload;
}

interface AccountsTransferAction {
	type: string;
	payload: AccountsTransferPayLoad;
}

const accounts = new Accounts();

export function* accountsDecryptWorker(action: AccountsDecryptAction) {
	const { success, failure, reset } = accounts.handlers.decrypt;

	try {
		const state: Store = yield select();

		if (state.config.load.response) {
			const list = state.config.load.response.storage.keystore.split('/');
			const popped = list.pop();

			if (popped === '/') {
				list.pop();
			}

			const keystoreParentDir = list.join('/');
			const evmlKeystore = new Keystore(keystoreParentDir, 'keystore');
			const account = yield evmlKeystore.get(action.payload.address);

			const decryptedAccount: Account = yield Account.decrypt(account, action.payload.password);

			yield put(success('Account decryption was successful.'));

			return decryptedAccount;
		}
	} catch (e) {
		yield put(failure('Something went wrong trying to decrypt your account.'));
	}

	yield put(reset());
}

export function* accountsTransferWorker(action: AccountsTransferAction) {
	try {
		const decryptedAccount = yield join(
			yield fork(accountsDecryptWorker, accounts.handlers.decrypt.init({
				address: action.payload.tx.from,
				password: action.payload.password
			}))
		);

		console.log(decryptedAccount);
	} catch (e) {
		// pass
	}
}
