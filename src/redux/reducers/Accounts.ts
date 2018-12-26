import { combineReducers } from 'redux';
import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Accounts, { AccountsDecryptPayload } from '../actions/Accounts';

// export type TransferAccountsReducer = IBasicReducer<string, string>;
export type AccountsDecryptType = IBasicReducer<AccountsDecryptPayload, string, string>;

export interface IAccountsReducer {
	// transfer: TransferAccountsReducer;
	decrypt: AccountsDecryptType;
}

const accounts = new Accounts();

const AccountsReducer = combineReducers({
	// transfer: accounts.SimpleReducer<string, string>('Transfer'),
	decrypt: accounts.SimpleReducer<AccountsDecryptPayload, string, string>('Decrypt')
});

export default AccountsReducer;
