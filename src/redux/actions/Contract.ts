import { TXReceipt, ABI, Contract as SolidityContract } from 'evm-lite-lib';

import BaseActions, {
	ActionCreatorHandlers,
	ActionInterface,
	ActionValue
} from '../common/BaseActions';

export interface ContractLoadPayload {
	address: string;
	abi: ABI[];
}

export interface ContractExecuteMethodPayload {
	params: any[];
}

export interface ContractExecuteConstantMethodPayload {
	params: any[];
	outputs: any[];
}

interface HandlerSchema {
	load: ActionCreatorHandlers<
		ContractLoadPayload,
		SolidityContract<any>,
		string
	>;
	executeMethod: ActionCreatorHandlers<
		ContractExecuteMethodPayload,
		TXReceipt,
		string
	>;
	executeConstantMethod: ActionCreatorHandlers<
		ContractExecuteConstantMethodPayload,
		any[],
		string
	>;
}

interface ActionSchema extends ActionInterface {
	load: ActionValue;
	executeMethod: ActionValue;
	executeConstantMethod: ActionValue;
}

export default class Contract extends BaseActions<HandlerSchema, ActionSchema> {
	public handlers: HandlerSchema;

	constructor() {
		super(Contract.name);

		this.prefixes = ['Load', 'ExecuteMethod', 'ExecuteConstantMethod'];

		this.handlers = {
			load: this.generateHandlers<
				ContractLoadPayload,
				SolidityContract<any>,
				string
			>('load'),
			executeMethod: this.generateHandlers<
				ContractExecuteMethodPayload,
				TXReceipt,
				string
			>('ExecuteMethod'),
			executeConstantMethod: this.generateHandlers<
				ContractExecuteConstantMethodPayload,
				any[],
				string
			>('ExecuteConstantMethod')
		};
	}
}
