import {combineReducers} from "redux";
import {BasicReducerState} from "../common/reducers/BasicReducerFactory";

import Accounts from "../actions/Accounts";


export interface AccountsReducer {
    transfer: BasicReducerState<string, string>;
    decrypt: BasicReducerState<string, string>;
}

const accounts = new Accounts();

const AccountsReducer = combineReducers({
    transfer: accounts.SimpleReducer<string, string>('TRANSFER'),
    decrypt: accounts.SimpleReducer<string, string>('DECRYPT'),
});

export default AccountsReducer;