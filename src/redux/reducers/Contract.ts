import { combineReducers } from 'redux';
import { TXReceipt } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Contract, {
	ContractExecuteMethodPayload,
	ContractExecuteConstantMethodPayload
} from '../actions/Contract';

export type ContractExecuteMethodReducer = IBasicReducer<
	ContractExecuteMethodPayload,
	TXReceipt,
	string
>;

export type ContractExecuteConstantMethodReducer = IBasicReducer<
	ContractExecuteMethodPayload,
	any[],
	string
>;

export interface ConfigReducer {
	executeMethod: ContractExecuteMethodReducer;
	executeConstantMethod: ContractExecuteConstantMethodReducer;
}

const contract = new Contract();

const ContractReducer = combineReducers({
	executeMethod: contract.SimpleReducer<
		ContractExecuteMethodReducer,
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
