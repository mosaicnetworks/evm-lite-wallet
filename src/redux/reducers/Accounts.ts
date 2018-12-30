import { combineReducers } from 'redux';
import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Accounts, { AccountsDecryptPayload, AccountsTransferPayLoad } from '../actions/Accounts';


export type AccountsTransferReducer = IBasicReducer<AccountsTransferPayLoad, string, string>;
export type AccountsDecryptReducer = IBasicReducer<AccountsDecryptPayload, string, string>;

export interface IAccountsReducer {
	transfer: AccountsTransferReducer;
	decrypt: AccountsDecryptReducer;
}

const accounts = new Accounts();

const AccountsReducer = combineReducers({
	transfer: accounts.SimpleReducer<AccountsTransferPayLoad, string, string>('Transfer'),
	decrypt: accounts.SimpleReducer<AccountsDecryptPayload, string, string>('Decrypt')
});

export default AccountsReducer;
