import { TXReceipt } from 'evm-lite-lib';

import BaseActions, {
	ActionCreatorHandlers,
	ActionInterface,
	ActionValue
} from '../common/BaseActions';

export interface ContractExecuteMethodPayload {
	params: any[];
}

export interface ContractExecuteConstantMethodPayload {
	params: any[];
	outputs: any[];
}

interface HandlerSchema {
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
	executeMethod: ActionValue;
	executeConstantMethod: ActionValue;
}

export default class Contract extends BaseActions<HandlerSchema, ActionSchema> {
	public handlers: HandlerSchema;

	constructor() {
		super(Contract.name);

		this.prefixes = ['ExecuteMethod', 'ExecuteConstantMethod'];

		this.handlers = {
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
