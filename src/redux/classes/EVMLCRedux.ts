import getStores from '../store/Store';
import Accounts from '../actions/Accounts';

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

	private readonly defaultStores: Stores;

	constructor() {
		this.defaultStores = getStores();

		this.accounts = new Accounts();
	}

	public get actions() {
		return {
			accounts: this.accounts.handlers
		};
	}

	public get stores(): Stores {
		return {
			store: this.defaultStores.store,
			persistor: this.defaultStores.persistor
		};
	}
}
