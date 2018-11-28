import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {createStore, combineReducers, applyMiddleware} from "redux";

import AccountsRootReducer, {AccountsReducer} from '../reducers/Accounts';
import ConfigRootReducer, {ConfigReducer} from '../reducers/Configuration';


export interface DefaultProps {
    [key: string]: any,
}

export interface Store {
    accounts: AccountsReducer,
    config: ConfigReducer
}

const rootReducer = combineReducers({
    accounts:  AccountsRootReducer,
    config: ConfigRootReducer,
});

const middleware = [thunk, logger];
const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;