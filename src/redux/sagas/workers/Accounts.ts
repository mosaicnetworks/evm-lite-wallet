import { fork, join, put, select } from 'redux-saga/effects';

import { Account, Database, Keystore, Transaction, TXReceipt } from 'evm-lite-lib';

import { Store } from '../..';
import { checkConnectivityWorker } from './Application';

import Accounts, { AccountsDecryptPayload, AccountsTransferPayLoad } from '../../actions/Accounts';
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
			yield put(reset());

			return decryptedAccount;
		}
	} catch (e) {
		yield put(failure('Error: ' + e));
		yield put(reset());
	}

}

export function* accountsTransferWorker(action: AccountsTransferAction) {
	const { failure, success } = accounts.handlers.transfer;

	try {
		const state: Store = yield select();

		if (!state.config.load.response) {
			yield put(failure('No configuration file initialised.'));
			return;
		}

		const evmlc = yield join(
			yield fork(checkConnectivityWorker, app.handlers.connectivity.init({
				host: state.config.load.response.connection.host,
				port: state.config.load.response.connection.port
			}))
		);

		const decryptedAccount = yield join(
			yield fork(accountsDecryptWorker, accounts.handlers.decrypt.init({
				address: action.payload.tx.from,
				password: action.payload.password
			}))
		);

		const transaction: Transaction = yield evmlc.prepareTransfer(
			action.payload.tx.to,
			action.payload.tx.value,
			action.payload.tx.from
		);

		console.log(transaction.tx);

		transaction.gas(action.payload.tx.gas);
		transaction.gasPrice(action.payload.tx.gasPrice);

		const signedTransaction = yield transaction.sign(decryptedAccount);
		const response: TXReceipt = yield signedTransaction.sendRawTX();

		const database = new Database(state.app.directory.payload!, 'db.json');
		console.log(database);
		const schema = database.transactions.create({
			from: action.payload.tx.from,
			to: action.payload.tx.to,
			value: action.payload.tx.value,
			gas: action.payload.tx.gas,
			nonce: 1,
			gasPrice: action.payload.tx.gas,
			date: new Date(),
			txHash: response.transactionHash
		});

		console.log(schema);
		yield database.transactions.insert(schema);
		console.log('Submitted to db');

		yield put(success(response));
	} catch (e) {
		console.log(e);
		yield put(failure(e.text || 'Something went wrong while transferring.'));
	}
}
