import logger from 'redux-logger';
import dynamicStorage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import AccountSagas from '../sagas/watchers/Accounts';
import AccountsRootReducer, { IAccountsReducer } from '../reducers/Accounts';

export interface Store {
	accounts: IAccountsReducer;
}

const persistConfig: PersistConfig = {
	key: 'root',
	storage: dynamicStorage,
	whitelist: ['app']
};

const rootReducer = combineReducers({
	accounts: AccountsRootReducer
});

const saga = createSagaMiddleware();
const middleware = [saga, logger];
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
	const store = createStore(persistedReducer, applyMiddleware(...middleware));
	const persistor = persistStore(store);

	saga.run(AccountSagas);

	return { store, persistor };
};
