import {combineReducers} from "redux";
import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Accounts from "../actions/Accounts";

export type TransferAccountsReducer = IBasicReducer<string, string>;
export type DecryptAccountsReducer = IBasicReducer<string, string>;

export interface AccountsReducer {
    transfer: TransferAccountsReducer;
    decrypt: DecryptAccountsReducer;
}

const accounts = new Accounts();

const AccountsReducer = combineReducers({
    transfer: accounts.SimpleReducer<string, string>('Transfer'),
    decrypt: accounts.SimpleReducer<string, string>('Decrypt'),
});

export default AccountsReducer;