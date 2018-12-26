import { combineReducers } from 'redux';
import { BaseAccount } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Keystore, { KeystoreListPayload, KeystoreUpdatePayload } from '../actions/Keystore';

export type KeystoreListType = IBasicReducer<KeystoreListPayload, BaseAccount[], string>;
export type KeystoreUpdateType = IBasicReducer<KeystoreUpdatePayload, BaseAccount, string>;

export interface KeystoreReducer {
	list: KeystoreListType;
	update: KeystoreUpdateType;
}

const keystore = new Keystore();

const KeystoreReducer = combineReducers({
	list: keystore.SimpleReducer<KeystoreListPayload, BaseAccount[], string>('List'),
	update: keystore.SimpleReducer<KeystoreUpdatePayload, BaseAccount, string>('Update')
});

export default KeystoreReducer;
