import { put, select } from 'redux-saga/effects';

import { Keystore as EVMLKeystore, EVMLC, BaseAccount } from 'evm-lite-lib';

import { BaseAction } from '../../common/AsyncActionSet';
import { Store } from '../../store/Store';

import Accounts, {
	AccountsFetchAllPayLoad,
	AccountsFetchOnePayLoad
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

		const account: BaseAccount = yield keystore.fetchBalanceAndNonce(
			action.payload.address,
			evmlc
		);

		yield put(success(account));

		return yield account;
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}
