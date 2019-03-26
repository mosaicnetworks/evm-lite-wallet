import { select, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { EVMLC, Contract as SolidityContract } from 'evm-lite-lib';

import { Store } from '../..';

import Contract, {
	ContractExecuteConstantMethodPayload,
	ContractExecuteMethodPayload,
	ContractLoadPayload
} from '../../actions/Contract';

interface ContractExecuteMethodAction {
	type: string;
	payload: ContractExecuteMethodPayload;
}

interface ContractLoadAction {
	type: string;
	payload: ContractLoadPayload;
}

interface ContractExecuteConstantMethodAction {
	type: string;
	payload: ContractExecuteConstantMethodPayload;
}

const contract = new Contract();

export function* contractLoadWorker(action: ContractLoadAction) {
	const { success, failure } = contract.handlers.load;
	try {
		const state: Store = yield select();
		const config = state.config.load.response!;

		const evmlc = new EVMLC(
			config.connection.host,
			config.connection.port,
			{
				from: config.defaults.from,
				gas: config.defaults.gas,
				gasPrice: config.defaults.gasPrice
			}
		);

		const contract: SolidityContract<any> = yield evmlc.contracts.load(
			action.payload.abi,
			{
				contractAddress: action.payload.address
			}
		);

		yield delay(2000);

		yield put(success(contract));
	} catch (e) {
		yield put(failure('Something went wrong trying to generate contract.'));
	}
}

export function* contractExecuteMethodWorker(
	action: ContractExecuteMethodAction
) {
	try {
		// pass
	} catch (e) {
		// pass
	}
}

export function* contractExecuteConstantMethodWorker(
	action: ContractExecuteConstantMethodAction
) {
	try {
		// pass
	} catch (e) {
		// pass
	}
}
