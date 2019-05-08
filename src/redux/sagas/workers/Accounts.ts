import { put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { Keystore as EVMLKeystore, EVMLC } from 'evm-lite-lib';

import { BaseAction } from '../../common/AsyncActionSet';
import { Store } from '../../store/Store';

import Accounts, { AccountsFetchAllPayLoad } from '../../actions/Accounts';

const accounts = new Accounts();

export function* accountsFetchAllWorker(
	action: BaseAction<AccountsFetchAllPayLoad>
) {
	const { success, failure } = accounts.actionStates.fetchAll.handlers;

	try {
		let evmlc;

		const state: Store = yield select();
		const config = state.config.load.response;
		const keystore: EVMLKeystore = new EVMLKeystore(
			action.payload.keystoreDirectory
		);

		if (config) {
			evmlc = new EVMLC(config.connection.host, config.connection.port, {
				from: config.defaults.from,
				gas: config.defaults.gas,
				gasPrice: config.defaults.gasPrice
			});
		}

		yield delay(2000);
		yield put(success(yield keystore.list(evmlc)));
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}
