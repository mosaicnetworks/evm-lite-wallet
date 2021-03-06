import { fork, join, put, select } from 'redux-saga/effects';

import { BaseAccount, Keystore as EVMLKeystore } from 'evm-lite-lib';

import { Store } from '../..';
import { checkConnectivityWorker } from './Application';

import Keystore, {
	KeystoreCreatePayLoad,
	KeystoreListPayLoad,
	KeystoreUpdatePayLoad
} from '../../actions/Keystore';
import Transactions from '../../actions/Transactions';
import Application from '../../actions/Application';
import { delay } from 'redux-saga';

interface KeystoreListAction {
	type: string;
	payload: KeystoreListPayLoad;
}

interface KeystoreUpdateAction {
	type: string;
	payload: KeystoreUpdatePayLoad;
}

interface KeystoreCreateAction {
	type: string;
	payload: KeystoreCreatePayLoad;
}

const keystore = new Keystore();
const transactions = new Transactions();
const app = new Application();

export function* keystoreListWorker(action: KeystoreListAction) {
	const { success, failure } = keystore.handlers.list;

	try {
		const evmlKeystore: EVMLKeystore = new EVMLKeystore(
			action.payload.directory,
			action.payload.name
		);
		const state: Store = yield select();

		let fetch: boolean = false;
		let connection: any;

		if (state.config.load.response) {
			const connected = yield join(
				yield fork(
					checkConnectivityWorker,
					app.handlers.connectivity.init({
						host: state.config.load.response.connection.host,
						port: state.config.load.response.connection.port
					})
				)
			);

			if (connected) {
				fetch = true;
				connection = connected;
			}
		}

		const accounts: BaseAccount[] = yield evmlKeystore.list(
			fetch,
			connection || null
		);
		yield put(success(accounts));

		yield put(
			transactions.handlers.history.init({
				addresses: accounts.map(account => account.address)
			})
		);
	} catch (e) {
		yield put(failure('Error: ' + e));
	}
}

export function* keystoreUpdateWorker(action: KeystoreUpdateAction) {
	const { success, failure, reset } = keystore.handlers.update;

	try {
		const state: Store = yield select();

		if (state.config.load.response) {
			yield delay(1000);

			const list = state.config.load.response.storage.keystore.split('/');
			let popped: string = list.pop() || 'keystore';

			if (popped === '/') {
				popped = list.pop() || 'keystore';
			}

			const keystoreParentDir = list.join('/');
			const evmlKeystore: EVMLKeystore = new EVMLKeystore(
				keystoreParentDir,
				popped
			);

			const account = yield evmlKeystore.update(
				action.payload.address,
				action.payload.old,
				action.payload.new
			);

			yield put(success(JSON.parse(account)));
		}
	} catch (e) {
		yield put(failure(e));
	}

	yield put(reset());
}

export function* keystoreCreateWorker(action: KeystoreCreateAction) {
	const { success, failure } = keystore.handlers.create;

	try {
		const list = action.payload.keystore.split('/');
		let popped = list.pop();

		if (popped === '/') {
			popped = list.pop();
		}

		const keystoreParentDir = list.join('/');
		const evmlKeystore = new EVMLKeystore(keystoreParentDir, popped!);

		const account = JSON.parse(
			yield evmlKeystore.create(action.payload.password)
		);

		yield join(
			yield fork(
				keystoreListWorker,
				keystore.handlers.list.init({
					directory: keystoreParentDir,
					name: 'keystore'
				})
			)
		);

		yield put(
			success({
				address: account.address,
				nonce: 0,
				balance: 0
			})
		);
	} catch (e) {
		yield put(failure(e));
	}
}
