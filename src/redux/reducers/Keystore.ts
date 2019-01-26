import { combineReducers } from 'redux';
import { BaseAccount } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Keystore, {
	KeystoreCreatePayLoad,
	KeystoreListPayLoad,
	KeystoreUpdatePayLoad
} from '../actions/Keystore';

export type KeystoreListReducer = IBasicReducer<
	KeystoreListPayLoad,
	BaseAccount[],
	string
>;
export type KeystoreUpdateReducer = IBasicReducer<
	KeystoreUpdatePayLoad,
	BaseAccount,
	string
>;
export type KeystoreCreateReducer = IBasicReducer<
	KeystoreCreatePayLoad,
	BaseAccount,
	string
>;

export interface KeystoreReducer {
	list: KeystoreListReducer;
	update: KeystoreUpdateReducer;
	create: KeystoreCreateReducer;
}

const keystore = new Keystore();

const KeystoreReducer = combineReducers({
	list: keystore.SimpleReducer<KeystoreListPayLoad, BaseAccount[], string>(
		'List'
	),
	update: keystore.SimpleReducer<KeystoreUpdatePayLoad, BaseAccount, string>(
		'Update'
	),
	create: keystore.SimpleReducer<KeystoreCreatePayLoad, BaseAccount, string>(
		'Create'
	)
});

export default KeystoreReducer;
