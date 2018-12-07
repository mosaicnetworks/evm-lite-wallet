import {combineReducers} from "redux";
import {BaseAccount} from "evm-lite-lib";

import {BasicReducerState} from "../common/reducers/BasicReducerFactory";

import Keystore from "../actions/Keystore";


export interface KeystoreReducer {
    fetch: BasicReducerState<BaseAccount[], string>;
    update: BasicReducerState<string, string>;
    create: BasicReducerState<string, string>;
    export: BasicReducerState<string, string>;
    import: BasicReducerState<string, string>;
}

const keystore = new Keystore();

const KeystoreReducer = combineReducers({
    fetch: keystore.SimpleReducer<BaseAccount[], string>('FETCH_LOCAL'),
    update: keystore.SimpleReducer<string, string>('UPDATE_PASSWORD'),
    create: keystore.SimpleReducer<string, string>('CREATE'),
    import: keystore.SimpleReducer<string, string>('IMPORT'),
    export: keystore.SimpleReducer<string, string>('EXPORT'),
});

export default KeystoreReducer;