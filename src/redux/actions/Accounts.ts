import { BaseAccount, Account } from 'evm-lite-lib';

import AsyncActionSet, { AsyncActionState } from '../common/AsyncActionSet';

export interface AccountsFetchAllPayLoad {
	keystoreDirectory: string;
}

export interface AccountsFetchOnePayLoad extends AccountsFetchAllPayLoad {
	address: string;
}

export interface AccountsCreatePayLoad {
	password: string;
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

export interface AccountsUnlockPayLoad {
	address: string;
	password: string;
}

interface AsyncActionStateSchema {
	unlock: AsyncActionState<AccountsUnlockPayLoad, Account, string>;
	fetchAll: AsyncActionState<AccountsFetchAllPayLoad, BaseAccount[], string>;
	fetchOne: AsyncActionState<AccountsFetchOnePayLoad, BaseAccount, string>;
	decrypt: AsyncActionState<AccountsDecryptPayload, string, string>;
	transfer: AsyncActionState<AccountsTransferPayLoad, string, string>;
	update: AsyncActionState<AccountsUpdatePayLoad, BaseAccount, string>;
	create: AsyncActionState<AccountsCreatePayLoad, BaseAccount, string>;
}

export default class Accounts extends AsyncActionSet<AsyncActionStateSchema> {
	constructor() {
		super(Accounts.name);

		this.actions = ['FetchAll', 'FetchOne', 'Create', 'Unlock'];
	}
}
