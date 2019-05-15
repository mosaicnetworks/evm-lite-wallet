import { combineReducers } from 'redux';
import { BaseAccount } from 'evm-lite-lib';

import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import Accounts, {
	AccountsFetchAllPayLoad,
	AccountsFetchOnePayLoad
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

export interface IAccountsReducer {
	fetchAll: AccountsFetchAllReducer;
	fetchOne: AccountsFetchOneReducer;
}

const accounts = new Accounts();

const AccountsReducer = combineReducers({
	fetchAll: accounts.actionStates.fetchAll.reducer,
	fetchOne: accounts.actionStates.fetchOne.reducer
});

export default AccountsReducer;
