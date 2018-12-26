import { SentTX } from 'evm-lite-lib';

import BaseActions, { ActionCreatorHandlers, ActionInterface, ActionValue } from '../common/BaseActions';


export interface TransactionHistoryPayload {
	addresses: string[];
}

export interface AccountTransactionHistory {
	[key: string]: SentTX[]
}

interface HandlerSchema {
	history: ActionCreatorHandlers<TransactionHistoryPayload, AccountTransactionHistory, string>;
}

interface ActionSchema extends ActionInterface {
	history: ActionValue;
}

export default class Transactions extends BaseActions<HandlerSchema, ActionSchema> {

	public handlers: HandlerSchema;

	constructor() {
		super(Transactions.name);

		this.prefixes = [
			'History'
		];

		this.handlers = {
			history:
				this.generateHandlers<TransactionHistoryPayload, AccountTransactionHistory, string>('History')
		};
	}

}

