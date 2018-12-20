import {combineReducers} from "redux";
import {BaseAccount} from "evm-lite-lib";

import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Keystore, {KeystoreListPayload} from "../actions/Keystore";

export type KeystoreListType = IBasicReducer<KeystoreListPayload, BaseAccount[], string>;

export interface KeystoreReducer {
    list: KeystoreListType;
}

const keystore = new Keystore();

const KeystoreReducer = combineReducers({
    list: keystore.SimpleReducer<KeystoreListPayload, BaseAccount[], string>('List'),
});

export default KeystoreReducer;