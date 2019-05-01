import { combineReducers } from 'redux';
import { BaseAccount } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BaseReducer';

import Accounts, { AccountsFetchAllPayLoad } from '../actions/Accounts';

export type AccountsFetchAllReducer = IBasicReducer<
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
