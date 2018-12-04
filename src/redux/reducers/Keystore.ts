import {combineReducers} from "redux";
import {BaseAccount} from "evm-lite-lib";

import {default as Actions} from "../actions/Keystore";

import BasicReducerFactory, {BasicReducerState} from "../common/BasicReducer";


export interface KeystoreReducer {
    fetch: BasicReducerState<BaseAccount[], string>;
    update: BasicReducerState<string, string>;
    create: BasicReducerState<string, string>;
    export: BasicReducerState<string, string>;
    import: BasicReducerState<string, string>;
}

const keystore = new Actions();
const SimpleReducer = <T1, T2>(prefix: string, initial?: BasicReducerState<T1, T2>) => {
    return BasicReducerFactory<Actions, T1, T2>(keystore, prefix, initial);
};

const KeystoreReducer = combineReducers({
    fetch: SimpleReducer<BaseAccount[], string>('FETCH_LOCAL'),
    update: SimpleReducer<string, string>('UPDATE_PASSWORD'),
    create: SimpleReducer<string, string>('CREATE'),
    import: SimpleReducer<string, string>('IMPORT'),
    export: SimpleReducer<string, string>('EXPORT'),
});

export default KeystoreReducer;