import getStores from '../store/Store';
import Application from '../actions/Application';
import Configuration from '../actions/Configuration';
import Keystore from '../actions/Keystore';
import Transactions from '../actions/Transactions';
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

	private readonly application: Application;
	private readonly configuration: Configuration;
	private readonly keystore: Keystore;
	private readonly transactions: Transactions;
	private readonly accounts: Accounts;

	private readonly defaultStores: Stores;

	constructor() {
		this.defaultStores = getStores();

		this.application = new Application();
		this.configuration = new Configuration();
		this.keystore = new Keystore();
		this.transactions = new Transactions();
		this.accounts = new Accounts();
	}

	public get actions() {
		return {
			application: this.application.handlers,
			configuration: this.configuration.handlers,
			keystore: this.keystore.handlers,
			transaction: this.transactions.handlers,
			accounts: this.accounts.handlers,
		};
	}

	public get stores(): Stores {
		return {
			store: this.defaultStores.store,
			persistor: this.defaultStores.persistor
		};
	}

}
