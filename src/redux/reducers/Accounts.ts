import {combineReducers} from "redux";
import {BaseAccount} from "evm-lite-lib";

import {default as Actions} from "../actions/Accounts";

import BasicReducerFactory, {ReducerState} from "../common/Reducer";


export interface AccountsReducer {
    fetch: ReducerState<BaseAccount[], string>;
    update: ReducerState<string, string>;
    create: ReducerState<string, string>;
    export: ReducerState<string, string>;
    import: ReducerState<string, string>;
    transfer: ReducerState<string, string>;
}

const SimpleReducer = <T1, T2>(prefix: string, initial: ReducerState<T1, T2>) => BasicReducerFactory<Actions, T1, T2>(Actions, prefix, initial);

const AccountsReducer = combineReducers({
    fetch: SimpleReducer<BaseAccount[], string>('FETCH_LOCAL', {
        isLoading: false,
        response: [],
        error: '',
    }),
    update: SimpleReducer<string, string>('UPDATE_PASSWORD', {
        isLoading: false,
        response: '',
        error: '',
    }),
    create: SimpleReducer<string, string>('CREATE', {
        isLoading: false,
        response: '',
        error: '',
    }),
    import: SimpleReducer<string, string>('IMPORT', {
        isLoading: false,
        response: '',
        error: '',
    }),
    export: SimpleReducer<string, string>('EXPORT', {
        isLoading: false,
        response: '',
        error: '',
    }),
    transfer: SimpleReducer<string, string>('TRANSFER', {
        isLoading: false,
        response: '',
        error: '',
    }),
});

export default AccountsReducer;
