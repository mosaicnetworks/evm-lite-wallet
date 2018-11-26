import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {createStore, combineReducers, applyMiddleware} from "redux";

import Accounts, {AccountsReducer} from '../reducers/Accounts';
import ConfigReducer, {ConfigReducerInitialState} from '../reducers/Configuration';


export interface DefaultProps {
    [key: string]: any,
}

export interface Store {
    accounts: AccountsReducer,
    config: ConfigReducerInitialState
}

const rootReducer = combineReducers({
    accounts:  Accounts,
    config: ConfigReducer,
});

const middleware = [thunk, logger];
const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;