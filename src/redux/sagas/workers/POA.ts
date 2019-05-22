import { put, select } from 'redux-saga/effects';

import { EVMLC } from 'evm-lite-lib';

import { BaseAction } from '../../common/AsyncActionSet';
import { Store } from '../../store/Store';
import { POASchema, POA_ABI, POA_ADDRESS } from '../../../poa/Contract';

import POAActions, { WhiteListEntry } from '../../actions/POA';

const poa = new POAActions();

function hexToString(hex: string) {
	let data = '';

	for (let i = 0; i < hex.length; i += 2) {
		data += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}

	return data;
}

export function* poaWhiteListWorker(action: BaseAction<undefined>) {
	const { success, failure } = poa.actionStates.whiteList.handlers;

	try {
		console.log('got here');
		const state: Store = yield select();
		const config = state.config.load.response;

		if (config) {
			const evmlc = new EVMLC(
				config.connection.host,
				config.connection.port,
				{
					from: config.defaults.from,
					gas: 100000000,
					gasPrice: 0
				}
			);

			const contract = evmlc.contracts.load<POASchema>(
				JSON.parse(POA_ABI),
				{
					contractAddress: POA_ADDRESS
				}
			);
			const transaction = contract.methods.getWhiteListCount();
			const response: any = yield transaction.submit();
			const whiteListCount = parseInt(response as string, 10);

			const whitelist: WhiteListEntry[] = [];

			for (const i of Array(whiteListCount).keys()) {
				const tx1 = contract.methods.getWhiteListAddressFromIdx(i);

				const whiteListAddress: any = yield tx1.submit();
				const tx2 = contract.methods.getMoniker(whiteListAddress);

				const hexMoniker: any = yield tx2.submit();
				const moniker = hexToString(hexMoniker as string);

				whitelist.push({
					address: whiteListAddress,
					moniker
				});
			}

			yield put(success(whitelist));
		} else {
			yield put(failure('No configuration loaded.'));
		}
	} catch (e) {
		yield put(failure('_SAGA_ERROR_' + e));
	}
}
