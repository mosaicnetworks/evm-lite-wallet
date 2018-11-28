import {combineReducers} from "redux";
import {BaseAccount} from "evm-lite-lib";

import {default as Actions} from "../actions/Accounts";

import BasicReducerFactory, {BasicReducerState} from "../common/Reducer";


export interface AccountsReducer {
    fetch: BasicReducerState<BaseAccount[], string>;
    update: BasicReducerState<string, string>;
    create: BasicReducerState<string, string>;
    export: BasicReducerState<string, string>;
    import: BasicReducerState<string, string>;
    transfer: BasicReducerState<string, string>;
}

const SimpleReducer = <T1, T2>(prefix: string, initial?: BasicReducerState<T1, T2>) => {
    return BasicReducerFactory<Actions, T1, T2>(Actions, prefix, initial);
};

const AccountsReducer = combineReducers({
    fetch: SimpleReducer<BaseAccount[], string>('FETCH_LOCAL'),
    update: SimpleReducer<string, string>('UPDATE_PASSWORD'),
    create: SimpleReducer<string, string>('CREATE'),
    import: SimpleReducer<string, string>('IMPORT'),
    export: SimpleReducer<string, string>('EXPORT'),
    transfer: SimpleReducer<string, string>('TRANSFER'),
});

export default AccountsReducer;



