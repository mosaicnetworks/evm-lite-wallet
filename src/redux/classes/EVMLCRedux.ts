import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import getStores from '../store/Store';

import Accounts from '../actions/Accounts';
import Config from '../actions/Config';
import DataDirectory from '../actions/DataDirectory';
import POA from '../actions/POA';
import Notifications from '../actions/Notifications';

export interface EVMLiteReduxConfig {
	host: 'localhost' | '127.0.0.1' | string;
	port: 8080 | 8000 | 80 | number;
	secure: boolean;
	debug: boolean;
}

interface Stores {
	store: any;
	persistor: any;
}

export default class EVMLCRedux {
	private readonly accounts: Accounts;
	private readonly config: Config;
	private readonly dataDirectory: DataDirectory;
	private readonly notifications: Notifications;
	private readonly poa: POA;
	private readonly defaultStores: Stores;

	constructor() {
		this.defaultStores = getStores();

		this.accounts = new Accounts();
		this.config = new Config();
		this.dataDirectory = new DataDirectory();
		this.notifications = new Notifications();
		this.poa = new POA();
	}

	public get actions() {
		return {
			notifications: this.notifications.allStates,
			accounts: this.accounts.actionStates,
			config: this.config.actionStates,
			dataDirectory: this.dataDirectory.actionStates,
			poa: this.poa.actionStates
		};
	}

	public get stores(): Stores {
		return {
			store: this.defaultStores.store,
			persistor: this.defaultStores.persistor
		};
	}

	public promiseWrapper<I, S, F>(reducer: IAsyncReducer<I, S, F>) {
		return new Promise<S>((resolve, reject) => {
			if (!reducer.isLoading) {
				if (reducer.response) {
					resolve(reducer.response);
				} else if (reducer.error) {
					reject(reducer.error);
				}
			}
		});
	}
}
