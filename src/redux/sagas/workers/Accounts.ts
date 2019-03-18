import * as path from 'path';

import { fork, join, put, select } from 'redux-saga/effects';

import { Database, Keystore, Transaction } from 'evm-lite-lib';

import { Store } from '../..';
import { checkConnectivityWorker } from './Application';
import { keystoreListWorker } from './Keystore';
import { default as KeystoreActions } from '../../actions/Keystore';

import Accounts, {
	AccountsDecryptPayload,
	AccountsTransferPayLoad
} from '../../actions/Accounts';
import Application from '../../actions/Application';

interface AccountsDecryptAction {
	type: string;
	payload: AccountsDecryptPayload;
}

interface AccountsTransferAction {
	type: string;
	payload: AccountsTransferPayLoad;
}

const accounts = new Accounts();
const app = new Application();
const keystore = new KeystoreActions();

export function* accountsDecryptWorker(action: AccountsDecryptAction) {
	const { success, failure, reset } = accounts.handlers.decrypt;

	try {
		const state: Store = yield select();

		if (state.config.load.response) {
			const evmlKeystore = new Keystore(
				state.config.load.response.storage.keystore
			);
			const decryptedAccount = yield evmlKeystore.decrypt(
				action.payload.address,
				action.payload.password
			);

			yield put(success('Account decryption was successful.'));

			yield put(reset());

			return decryptedAccount;
		}
	} catch (e) {
		yield put(failure('Error: ' + e));
		yield put(reset());
	}
}

export function* accountsTransferWorker(action: AccountsTransferAction) {
	const { failure, reset, success } = accounts.handlers.transfer;

	try {
		const state: Store = yield select();

		if (!state.config.load.response) {
			yield put(failure('No configuration file initialised.'));
			return;
		}

		const evmlc = yield join(
			yield fork(
				checkConnectivityWorker,
				app.handlers.connectivity.init({
					host: state.config.load.response.connection.host,
					port: state.config.load.response.connection.port
				})
			)
		);

		if (!evmlc) {
			yield put(failure('Decryption failed. Please try again.'));
			return;
		}

		const decryptedAccount = yield join(
			yield fork(
				accountsDecryptWorker,
				accounts.handlers.decrypt.init({
					address: action.payload.tx.from,
					password: action.payload.password
				})
			)
		);

		if (!decryptedAccount) {
			yield put(failure('Decryption failed. Please try again.'));
			return;
		}

		const transaction: Transaction = yield evmlc.accounts.prepareTransfer(
			action.payload.tx.to,
			action.payload.tx.value,
			action.payload.tx.from
		);

		transaction.gas(action.payload.tx.gas);
		transaction.gasPrice(action.payload.tx.gasPrice);

		yield transaction.submit(decryptedAccount);

		const database = new Database(
			path.join(state.app.directory.payload!, 'db.json')
		);
		const schema = database.transactions.create({
			from: action.payload.tx.from,
			to: action.payload.tx.to,
			value: action.payload.tx.value,
			gas: action.payload.tx.gas,
			nonce: 1,
			gasPrice: action.payload.tx.gas,
			date: new Date(),
			txHash: transaction.hash!
		});

		yield database.transactions.insert(schema);
		console.log(schema);

		yield join(
			yield fork(
				keystoreListWorker,
				keystore.handlers.list.init({
					path: state.config.load.response.storage.keystore
				})
			)
		);

		yield put(success(transaction.hash!));
	} catch (e) {
		yield put(
			failure(e.text || 'Something went wrong while transferring.')
		);
	}

	yield put(reset());
}
