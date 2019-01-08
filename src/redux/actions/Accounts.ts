import BaseActions, { ActionCreatorHandlers, ActionInterface, ActionValue } from '../common/BaseActions';


export interface AccountsDecryptPayload {
	address: string;
	password: string;
}

export interface AccountsTransferPayLoad {
	tx: {
		to: string;
		from: string;
		value: number;
		gas: number;
		gasPrice: number;
	},
	password: string;
}

interface HandlerSchema {
	decrypt: ActionCreatorHandlers<AccountsDecryptPayload, string, string>;
	transfer: ActionCreatorHandlers<AccountsTransferPayLoad, string, string>;
}

interface ActionSchema extends ActionInterface {
	decrypt: ActionValue;
	transfer: ActionValue;
}

export default class Accounts extends BaseActions<HandlerSchema, ActionSchema> {

	public handlers: HandlerSchema;

	constructor() {
		super(Accounts.name);

		this.prefixes = [
			'Transfer',
			'Decrypt'
		];

		this.handlers = {
			decrypt: this.generateHandlers<AccountsDecryptPayload, string, string>('Decrypt'),
			transfer: this.generateHandlers<AccountsTransferPayLoad, string, string>('Transfer')
		};
	}

}

