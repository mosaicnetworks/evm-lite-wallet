import { fork, join, put, select } from 'redux-saga/effects';

import {
	Keystore as EVMLKeystore,
	EVMLC,
	BaseAccount,
	Keystore
} from 'evm-lite-lib';

import { BaseAction } from '../../common/AsyncActionSet';
import { Store } from '../../store/Store';

import Accounts, {
	AccountsFetchAllPayLoad,
	AccountsFetchOnePayLoad,
	AccountsCreatePayLoad
} from '../../actions/Accounts';

const accounts = new Accounts();

export function* accountsFetchAllWorker(
	action: BaseAction<AccountsFetchAllPayLoad>
) {
	const { success, failure } = accounts.actionStates.fetchAll.handlers;

	try {
		let evmlc: EVMLC | undefined;

		const state: Store = yield select();
		const config = state.config.load.response;
		const keystore: EVMLKeystore = new EVMLKeystore(
			action.payload.keystoreDirectory
		);

		// Check if default connection details exist
		if (config) {
			const connection = new EVMLC(
				config.connection.host,
				config.connection.port,
				{
					from: config.defaults.from,
					gas: config.defaults.gas,
					gasPrice: config.defaults.gasPrice
				}
			);

			try {
				// Check if there is a valid connection
				const valid: boolean = yield connection.testConnection();

				if (valid) {
					evmlc = connection;
				}
			} catch (e) {
				evmlc = undefined;
			}
		}

		yield put(success(yield keystore.list(evmlc)));
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}

export function* accountsFetchOneWorker(
	action: BaseAction<AccountsFetchOnePayLoad>
) {
	const { success, failure } = accounts.actionStates.fetchOne.handlers;

	try {
		let evmlc: EVMLC | undefined;

		const state: Store = yield select();
		const config = state.config.load.response;
		const keystore: EVMLKeystore = new EVMLKeystore(
			action.payload.keystoreDirectory
		);

		// Check if default connection details exist
		if (config) {
			const connection = new EVMLC(
				config.connection.host,
				config.connection.port,
				{
					from: config.defaults.from,
					gas: config.defaults.gas,
					gasPrice: config.defaults.gasPrice
				}
			);

			try {
				// Check if there is a valid connection
				const valid: boolean = yield connection.testConnection();

				if (valid) {
					evmlc = connection;
				}
			} catch (e) {
				evmlc = undefined;
			}
		}

		console.log(keystore);
		console.log(evmlc);
		let account: BaseAccount = {
			address: action.payload.address,
			balance: 0,
			nonce: 0
		};

		if (evmlc) {
			account = yield evmlc.accounts.getAccount(action.payload.address);
		}
		yield put(success(account));

		return yield account;
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}

export function* accountsCreateWorker(
	action: BaseAction<AccountsCreatePayLoad>
) {
	const { success, failure, reset } = accounts.actionStates.create.handlers;
	const fetchAll = accounts.actionStates.fetchAll.handlers;

	try {
		const state: Store = yield select();
		const config = state.config.load.response;

		if (config) {
			const keystoreDirectory = config.storage.keystore;
			const keystore = new Keystore(keystoreDirectory);

			const address: string = yield keystore.create(
				action.payload.password
			);

			yield put(
				success({
					address,
					balance: 0,
					nonce: 0
				})
			);

			yield put(fetchAll.reset());
			yield join(
				yield fork(
					accountsFetchAllWorker,
					accounts.actionStates.fetchAll.handlers.init({
						keystoreDirectory
					})
				)
			);
		} else {
			yield put(failure('No configuration loaded.'));
		}
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}

	yield put(reset());
}
