import logger from 'redux-logger';
import dynamicStorage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import {PersistConfig, persistReducer, persistStore} from 'redux-persist'
import {applyMiddleware, combineReducers, createStore} from "redux";
import {InjectedAlertProp} from "react-alert";

import {checkConnectivityInitWatcher, dataDirectoryChangeInitWatcher} from "../sagas/Application";
import {configurationReadInitWatcher} from "../sagas/Configuration";
import {keystoreListInitWatcher} from "../sagas/Keystore";

// import AccountsRootReducer, {AccountsReducer} from '../reducers/Accounts';
import ConfigRootReducer, {ConfigReducer} from '../reducers/Configuration';
import AppRootReducer, {AppReducer} from "../reducers/Application";
import KeystoreRootReducer, {KeystoreReducer} from "../reducers/Keystore";
// import TransactionRootReducer, {ITransactionsReducer} from "../reducers/Transactions";


export interface DefaultProps {
    alert: InjectedAlertProp;

    [key: string]: any;
}

export interface Store {
    keystore: KeystoreReducer;
    // accounts: AccountsReducer;
    config: ConfigReducer;
    app: AppReducer;
    // transaction: ITransactionsReducer
}

const persistConfig: PersistConfig = {
    key: 'root',
    storage: dynamicStorage,
    whitelist: ['app']
};

const rootReducer = combineReducers({
    keystore: KeystoreRootReducer,
    // accounts: AccountsRootReducer,
    config: ConfigRootReducer,
    app: AppRootReducer,
    // transaction: TransactionRootReducer,
});

const saga = createSagaMiddleware();
const middleware = [saga, logger];
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    const store = createStore(persistedReducer, applyMiddleware(...middleware));
    const persistor = persistStore(store);

    saga.run(dataDirectoryChangeInitWatcher);
    saga.run(configurationReadInitWatcher);
    saga.run(checkConnectivityInitWatcher);
    saga.run(keystoreListInitWatcher);

    return {store, persistor}
}
