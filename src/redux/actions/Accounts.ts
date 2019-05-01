import { BaseAccount } from 'evm-lite-lib';

import ActionSet, { ActionState } from '../common/ActionSet';

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

interface ActionStateSchema {
	fetchAll: ActionState<AccountsFetchAllPayLoad, any[], string>;
	fetchOne: ActionState<AccountsFetchOnePayLoad, any[], string>;
	decrypt: ActionState<AccountsDecryptPayload, string, string>;
	transfer: ActionState<AccountsTransferPayLoad, string, string>;
	update: ActionState<AccountsUpdatePayLoad, BaseAccount, string>;
	create: ActionState<AccountsCreatePayLoad, BaseAccount, string>;
}

export default class Accounts extends ActionSet<ActionStateSchema> {
	constructor() {
		super(Accounts.name);

		this.actions = ['FetchAll'];
	}
}
