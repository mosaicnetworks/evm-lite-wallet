import { BaseAccount } from 'evm-lite-lib';

import AsyncActionSet, { AsyncActionState } from '../common/AsyncActionSet';

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

interface AsyncActionStateSchema {
	fetchAll: AsyncActionState<AccountsFetchAllPayLoad, any[], string>;
	fetchOne: AsyncActionState<AccountsFetchOnePayLoad, any[], string>;
	decrypt: AsyncActionState<AccountsDecryptPayload, string, string>;
	transfer: AsyncActionState<AccountsTransferPayLoad, string, string>;
	update: AsyncActionState<AccountsUpdatePayLoad, BaseAccount, string>;
	create: AsyncActionState<AccountsCreatePayLoad, BaseAccount, string>;
}

export default class Accounts extends AsyncActionSet<AsyncActionStateSchema> {
	constructor() {
		super(Accounts.name);

		this.actions = ['FetchAll'];
	}
}
