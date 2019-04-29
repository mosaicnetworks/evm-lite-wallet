import { put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { Keystore as EVMLKeystore } from 'evm-lite-lib';

import { BaseAction } from '../../common/BaseActions';

import Accounts, { AccountsFetchAllPayLoad } from '../../actions/Accounts';

const accounts = new Accounts();

export function* accountsFetchAllWorker(
	action: BaseAction<AccountsFetchAllPayLoad>
) {
	const { success, failure } = accounts.handlers.fetchAll;

	try {
		const keystore: EVMLKeystore = new EVMLKeystore(
			action.payload.keystoreDirectory
		);

		yield delay(3000);
		yield put(success(yield keystore.list()));
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}
