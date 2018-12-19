import thunk from 'redux-thunk';
import logger from 'redux-logger';
import dynamicStorage from 'redux-persist/lib/storage';

import {PersistConfig, persistReducer, persistStore} from 'redux-persist'
import {applyMiddleware, combineReducers, createStore} from "redux";
import {InjectedAlertProp} from "react-alert";

import AccountsRootReducer, {AccountsReducer} from '../reducers/Accounts';
import ConfigRootReducer, {ConfigReducer} from '../reducers/Configuration';
import AppRootReducer, {AppReducer} from "../reducers/App";
import KeystoreRootReducer, {KeystoreReducer} from "../reducers/Keystore";
import TransactionRootReducer, {ITransactionsReducer} from "../reducers/Transactions";


export interface DefaultProps {
    alert: InjectedAlertProp;
    [key: string]: any;
}

export interface Store {
    keystore: KeystoreReducer;
    accounts: AccountsReducer;
    config: ConfigReducer;
    app: AppReducer;
    transaction: ITransactionsReducer
}

const persistConfig: PersistConfig = {
    key: 'root',
    storage: dynamicStorage,
    whitelist: ['app']
};

const rootReducer = combineReducers({
    keystore: KeystoreRootReducer,
    accounts: AccountsRootReducer,
    config: ConfigRootReducer,
    app: AppRootReducer,
    transaction: TransactionRootReducer,
});

const middleware = [thunk, logger];
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    const store = createStore(persistedReducer, applyMiddleware(...middleware));
    const persistor = persistStore(store);

    return {store, persistor}
}
