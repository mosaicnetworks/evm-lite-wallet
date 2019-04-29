import { BaseAccount } from 'evm-lite-lib';

import BaseActions, {
	ActionCreatorHandlers,
	ActionInterface,
	ActionValue
} from '../common/BaseActions';

// Payloads

export interface AccountsFetchAllPayLoad {
	keystoreDirectory: string;
}

export interface AccountsFetchOnePayLoad extends AccountsFetchAllPayLoad {
	address: string;
}

export interface AccountsCreatePayLoad {
	password: string;
	keystore: string;
}
export interface AccountsUpdatePayLoad {
	address: string;
	old: string;
	new: string;
}

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
	};
	password: string;
}

// Framework

interface HandlerSchema {
	fetchAll: ActionCreatorHandlers<AccountsFetchAllPayLoad, any[], string>;
	// fetchOne: ActionCreatorHandlers<AccountsFetchOnePayLoad, any[], string>;
	// decrypt: ActionCreatorHandlers<AccountsDecryptPayload, string, string>;
	// transfer: ActionCreatorHandlers<AccountsTransferPayLoad, string, string>;
	// update: ActionCreatorHandlers<AccountsUpdatePayLoad, BaseAccount, string>;
	// create: ActionCreatorHandlers<AccountsCreatePayLoad, BaseAccount, string>;
}

interface ActionSchema extends ActionInterface {
	fetchAll: ActionValue;
	// fetchOne: ActionValue;
	// decrypt: ActionValue;
	// transfer: ActionValue;
	// update: ActionValue;
	// create: ActionValue;
}

export default class Accounts extends BaseActions<HandlerSchema, ActionSchema> {
	public handlers: HandlerSchema;

	constructor() {
		super(Accounts.name);

		// Not case sensitive
		this.prefixes = ['FetchAll'];

		this.handlers = {
			fetchAll: this.generateHandlers<
				AccountsFetchAllPayLoad,
				BaseAccount[],
				string
			>('FetchAll')
			// fetchOne: this.generateHandlers<
			// 	AccountsFetchOnePayLoad,
			// 	any[],
			// 	string
			// >('FetchAll'),
			// decrypt: this.generateHandlers<
			// 	AccountsDecryptPayload,
			// 	string,
			// 	string
			// >('Decrypt'),
			// transfer: this.generateHandlers<
			// 	AccountsTransferPayLoad,
			// 	string,
			// 	string
			// >('Transfer'),
			// update: this.generateHandlers<
			// 	AccountsUpdatePayLoad,
			// 	BaseAccount,
			// 	string
			// >('Update'),
			// create: this.generateHandlers<
			// 	AccountsCreatePayLoad,
			// 	BaseAccount,
			// 	string
			// >('Create')
		};
	}
}
