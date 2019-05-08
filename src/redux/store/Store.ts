import logger from 'redux-logger';
import dynamicStorage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import AccountSagas from '../sagas/watchers/Accounts';
import ConfigSagas from '../sagas/watchers/Config';
import DataDirectorySagas from '../sagas/watchers/DataDirectory';

import AccountsRootReducer, { IAccountsReducer } from '../reducers/Accounts';
import NotificationsReducer, {
	INotificationsReducer
} from '../reducers/Notifications';
import POARootReducer, { IPOAReducer } from '../reducers/POA';
import ConfigRootReducer, { IConfigReducer } from '../reducers/Config';
import DataDirectoryRootReducer, {
	IDataDirectoryReducer
} from '../reducers/DataDirectory';

export interface Store {
	notifications: INotificationsReducer;
	accounts: IAccountsReducer;
	config: IConfigReducer;
	dataDirectory: IDataDirectoryReducer;
	poa: IPOAReducer;
}

const persistConfig: PersistConfig = {
	key: 'root',
	storage: dynamicStorage,
	whitelist: ['dataDirectory']
};

const rootReducer = combineReducers({
	notifications: NotificationsReducer,
	dataDirectory: DataDirectoryRootReducer,
	accounts: AccountsRootReducer,
	config: ConfigRootReducer,
	poa: POARootReducer
});

const saga = createSagaMiddleware();
const middleware = [saga, logger];
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
	const store = createStore(persistedReducer, applyMiddleware(...middleware));
	const persistor = persistStore(store);

	saga.run(AccountSagas);
	saga.run(ConfigSagas);
	saga.run(DataDirectorySagas);

	return { store, persistor };
};
