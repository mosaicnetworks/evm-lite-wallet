import { combineReducers } from 'redux';
import { BaseAccount, V3JSONKeyStore, Account } from 'evm-lite-lib';

import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import Accounts, {
	AccountsFetchAllPayLoad,
	AccountsFetchOnePayLoad,
	AccountsCreatePayLoad,
	AccountsUnlockPayLoad
} from '../actions/Accounts';

export type AccountsFetchAllReducer = IAsyncReducer<
	AccountsFetchAllPayLoad,
	BaseAccount[],
	string
>;

export type AccountsFetchOneReducer = IAsyncReducer<
	AccountsFetchOnePayLoad,
	BaseAccount,
	string
>;

export type AccountsCreateReducer = IAsyncReducer<
	AccountsCreatePayLoad,
	V3JSONKeyStore,
	string
>;

export type AccountsUnlockReducer = IAsyncReducer<
	AccountsUnlockPayLoad,
	Account,
	string
>;

export interface IAccountsReducer {
	unlock: AccountsUnlockReducer;
	fetchAll: AccountsFetchAllReducer;
	fetchOne: AccountsFetchOneReducer;
	create: AccountsCreateReducer;
}

const accounts = new Accounts();

const AccountsReducer = combineReducers({
	fetchAll: accounts.actionStates.fetchAll.reducer,
	fetchOne: accounts.actionStates.fetchOne.reducer,
	create: accounts.actionStates.create.reducer,
	unlock: accounts.actionStates.unlock.reducer
});

export default AccountsReducer;
