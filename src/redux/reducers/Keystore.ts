import {combineReducers} from "redux";
import {BaseAccount} from "evm-lite-lib";

import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Keystore from "../actions/Keystore";


export interface KeystoreReducer {
    fetch: IBasicReducer<BaseAccount[], string>;
    update: IBasicReducer<string, string>;
    create: IBasicReducer<string, string>;
    export: IBasicReducer<string, string>;
    import: IBasicReducer<string, string>;
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