import { put } from 'redux-saga/effects';

import { Keystore as EVMLKeystore } from 'evm-lite-lib';

import { BaseAction } from '../../common/ActionSet';

import Accounts, { AccountsFetchAllPayLoad } from '../../actions/Accounts';

const accounts = new Accounts();

export function* accountsFetchAllWorker(
	action: BaseAction<AccountsFetchAllPayLoad>
) {
	const { success, failure } = accounts.actionStates.fetchAll.handlers;

	try {
		const keystore: EVMLKeystore = new EVMLKeystore(
			action.payload.keystoreDirectory
		);

		yield put(success(yield keystore.list()));
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}
