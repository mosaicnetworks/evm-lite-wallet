import getStores from '../store/Store';

import Accounts from '../actions/Accounts';
import Config from '../actions/Config';
import DataDirectory from '../actions/DataDirectory';

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

	private readonly defaultStores: Stores;

	constructor() {
		this.defaultStores = getStores();

		this.accounts = new Accounts();
		this.config = new Config();
		this.dataDirectory = new DataDirectory();
	}

	public get actions() {
		return {
			accounts: this.accounts.handlers,
			config: this.config.handlers,
			dataDirectory: this.dataDirectory.handlers
		};
	}

	public get stores(): Stores {
		return {
			store: this.defaultStores.store,
			persistor: this.defaultStores.persistor
		};
	}
}
