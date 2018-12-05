import {combineReducers} from "redux";

import {default as Actions} from "../actions/Accounts";

import BasicReducerFactory, {BasicReducerState} from "../common/BasicReducer";


export interface AccountsReducer {
    transfer: BasicReducerState<string, string>;
    decrypt: BasicReducerState<string, string>;
}

const accounts = new Actions();
const SimpleReducer = <T1, T2>(prefix: string, initial?: BasicReducerState<T1, T2>) => {
    return BasicReducerFactory<Actions, T1, T2>(accounts, prefix, initial);
};

const AccountsReducer = combineReducers({
    transfer: SimpleReducer<string, string>('TRANSFER'),
    decrypt: SimpleReducer<string, string>('DECRYPT'),
});

export default AccountsReducer;