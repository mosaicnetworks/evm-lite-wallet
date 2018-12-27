import { combineReducers } from 'redux';
import { BaseAccount } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Keystore, { KeystoreListPayLoad, KeystoreUpdatePayLoad } from '../actions/Keystore';

export type KeystoreListType = IBasicReducer<KeystoreListPayLoad, BaseAccount[], string>;
export type KeystoreUpdateType = IBasicReducer<KeystoreUpdatePayLoad, BaseAccount, string>;

export interface KeystoreReducer {
	list: KeystoreListType;
	update: KeystoreUpdateType;
}

const keystore = new Keystore();

const KeystoreReducer = combineReducers({
	list: keystore.SimpleReducer<KeystoreListPayLoad, BaseAccount[], string>('List'),
	update: keystore.SimpleReducer<KeystoreUpdatePayLoad, BaseAccount, string>('Update')
});

export default KeystoreReducer;
