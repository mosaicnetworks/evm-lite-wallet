import { combineReducers } from 'redux';
import { BaseAccount } from 'evm-lite-lib';

import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import Accounts, { AccountsFetchAllPayLoad } from '../actions/Accounts';

export type AccountsFetchAllReducer = IAsyncReducer<
	AccountsFetchAllPayLoad,
	BaseAccount[],
	string
>;

export interface IAccountsReducer {
	fetchAll: AccountsFetchAllReducer;
}

const accounts = new Accounts();

const AccountsReducer = combineReducers({
	fetchAll: accounts.actionStates.fetchAll.reducer
});

export default AccountsReducer;
