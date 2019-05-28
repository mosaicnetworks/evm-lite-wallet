import { createStore, applyMiddleware } from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './modules';

import { AccountsState } from './modules/accounts';
import { ApplicationState } from './modules/application';
import { ConfigurationState } from './modules/configuration';

export interface Store {
	accounts: AccountsState;
	app: ApplicationState;
	config: ConfigurationState;
}

const middleware = [thunk, logger];

export default createStore(rootReducer, applyMiddleware(...middleware));
