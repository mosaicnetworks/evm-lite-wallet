import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {createStore, combineReducers, applyMiddleware} from "redux";

import AccountsRootReducer, {AccountsReducer} from '../reducers/Accounts';
import ConfigRootReducer, {ConfigReducer} from '../reducers/Configuration';
import AppRootReducer, {AppReducer} from "../reducers/App";
import KeystoreRootReducer, {KeystoreReducer} from "../reducers/Keystore";


export interface DefaultProps {
    [key: string]: any;
}

export interface Store {
    keystore: KeystoreReducer;
    accounts: AccountsReducer;
    config: ConfigReducer;
    app: AppReducer;
}

const rootReducer = combineReducers({
    keystore: KeystoreRootReducer,
    accounts:  AccountsRootReducer,
    config: ConfigRootReducer,
    app: AppRootReducer,
});

const middleware = [thunk, logger];
const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;