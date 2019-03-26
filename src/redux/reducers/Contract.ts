import { combineReducers } from 'redux';
import { TXReceipt, Contract as SolidityContract } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Contract, {
	ContractExecuteMethodPayload,
	ContractExecuteConstantMethodPayload,
	ContractLoadPayload
} from '../actions/Contract';

export type ContractLoadReducer = IBasicReducer<
	ContractLoadPayload,
	SolidityContract<any>,
	string
>;

export type ContractExecuteMethodReducer = IBasicReducer<
	ContractExecuteMethodPayload,
	SolidityContract<any>,
	string
>;

export type ContractExecuteConstantMethodReducer = IBasicReducer<
	ContractExecuteMethodPayload,
	any[],
	string
>;

export interface ContractReducer {
	load: ContractLoadReducer;
	executeMethod: ContractExecuteMethodReducer;
	executeConstantMethod: ContractExecuteConstantMethodReducer;
}

const contract = new Contract();

const ContractReducer = combineReducers({
	load: contract.SimpleReducer<
		ContractLoadPayload,
		SolidityContract<any>,
		string
	>('load'),
	executeMethod: contract.SimpleReducer<
		ContractExecuteMethodPayload,
		TXReceipt,
		string
	>('ExecuteMethod'),
	executeConstantMethod: contract.SimpleReducer<
		ContractExecuteConstantMethodPayload,
		any[],
		string
	>('ExecuteConstantMethod')
});

export default ContractReducer;
