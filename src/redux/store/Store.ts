import logger from 'redux-logger';
import dynamicStorage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import {PersistConfig, persistReducer, persistStore} from 'redux-persist'
import {applyMiddleware, combineReducers, createStore} from "redux";
import {InjectedAlertProp} from "react-alert";

import applicationSagas from "../sagas/Application";
import configurationSagas from "../sagas/Configuration";
import keystoreSagas from "../sagas/Keystore";
import transactionSagas from "../sagas/Transactions";
import accountsSaga from '../sagas/Accounts';

import ConfigRootReducer, {ConfigReducer} from '../reducers/Configuration';
import AppRootReducer, {AppReducer} from "../reducers/Application";
import KeystoreRootReducer, {KeystoreReducer} from "../reducers/Keystore";
import TransactionsRootReducer, {ITransactionsReducer} from "../reducers/Transactions";
import AccountsRootReducer, {IAccountsReducer} from "../reducers/Accounts";


export interface DefaultProps {
    alert: InjectedAlertProp;

    [key: string]: any;
}

export interface Store {
    accounts: IAccountsReducer;
    keystore: KeystoreReducer;
    config: ConfigReducer;
    app: AppReducer;
    transactions: ITransactionsReducer
}

const persistConfig: PersistConfig = {
    key: 'root',
    storage: dynamicStorage,
    whitelist: ['app']
};

const rootReducer = combineReducers({
    accounts: AccountsRootReducer,
    keystore: KeystoreRootReducer,
    config: ConfigRootReducer,
    app: AppRootReducer,
    transactions: TransactionsRootReducer,
});

const saga = createSagaMiddleware();
const middleware = [saga, logger];
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    const store = createStore(persistedReducer, applyMiddleware(...middleware));
    const persistor = persistStore(store);

    saga.run(applicationSagas);
    saga.run(configurationSagas);
    saga.run(keystoreSagas);
    saga.run(transactionSagas);
    saga.run(accountsSaga);

    return {store, persistor}
}
