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
    fetch: keystore.SimpleReducer<BaseAccount[], string>('List'),
    update: keystore.SimpleReducer<string, string>('Update'),
    create: keystore.SimpleReducer<string, string>('Create'),
    import: keystore.SimpleReducer<string, string>('Import'),
    export: keystore.SimpleReducer<string, string>('Export'),
});

export default KeystoreReducer;