import {
	BaseAccount,
	Keystore,
	V3JSONKeyStore,
	EVMLC,
	Static,
	Account
} from 'evm-lite-lib';

import { BaseAction, ThunkResult } from 'src/modules';

// Lists all accounts in keystore
const LIST_REQUEST = '@monet/accounts/LIST/REQUEST';
const LIST_SUCCESS = '@monet/accounts/LIST/SUCCESS';
const LIST_ERROR = '@monet/accounts/LIST/ERROR';

// Creates account in keystore
const CREATE_REQUEST = '@monet/accounts/CREATE/REQUEST';
const CREATE_SUCCESS = '@monet/accounts/CREATE/SUCCESS';
const CREATE_ERROR = '@monet/accounts/CREATE/ERROR';

// Get account balance and nonce from node
const GET_REQUEST = '@monet/accounts/GET/REQUEST';
const GET_SUCCESS = '@monet/accounts/GET/SUCCESS';
const GET_ERROR = '@monet/accounts/GET/ERROR';

// For decrypting an account
const UNLOCK_REQUEST = 'monet/accounts/UNLOCK/REQUEST';
const UNLOCK_SUCCESS = 'monet/accounts/UNLOCK/SUCCESS';
const UNLOCK_ERROR = 'monet/accounts/UNLOCK/ERROR';
const UNLOCK_RESET = 'monet/accounts/UNLOCK/RESET';

function integerWithCommas(x: number | string) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Accounts state structure
export interface AccountsState {
	all: any[];
	unlocked?: Account;
	error?: string;
	loading: {
		list: boolean;
		get: boolean;
		create: boolean;
		unlock: boolean;
	};
}

const initialState: AccountsState = {
	all: [],
	loading: {
		list: false,
		get: false,
		create: false,
		unlock: false
	}
};

export default function reducer(
	state: AccountsState = initialState,
	action: BaseAction<any> = {} as BaseAction<any>
): AccountsState {
	switch (action.type) {
		// List accounts
		case LIST_REQUEST:
			return {
				...state,
				all: [],
				error: undefined,
				loading: {
					...state.loading,
					list: true
				}
			};
		case LIST_SUCCESS:
			return {
				...state,
				all: action.payload,
				loading: {
					...state.loading,
					list: false
				}
			};
		case LIST_ERROR:
			return {
				...state,
				all: [],
				error: action.payload,
				loading: {
					...state.loading,
					list: false
				}
			};

		// Create account
		case CREATE_REQUEST:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					create: true
				}
			};
		case CREATE_SUCCESS:
			return {
				...state,
				error: undefined,
				all: [...state.all, action.payload],
				loading: {
					...state.loading,
					create: false
				}
			};
		case CREATE_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					create: false
				}
			};

		// Get account
		case GET_REQUEST:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					get: true
				}
			};
		case GET_SUCCESS:
			const accounts = state.all.map(acc => {
				if (
					Static.cleanAddress(acc.address) ===
					Static.cleanAddress(action.payload.address)
				) {
					acc.balance = action.payload.balance;
					acc.nonce = action.payload.nonce;
				}

				return acc;
			});

			return {
				...state,
				error: undefined,
				all: accounts,
				loading: {
					...state.loading,
					get: false
				}
			};
		case GET_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					get: false
				}
			};

		// Unlock account
		case UNLOCK_REQUEST:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					unlock: true
				}
			};
		case UNLOCK_SUCCESS:
			return {
				...state,
				unlocked: action.payload,
				error: undefined,
				loading: {
					...state.loading,
					unlock: false
				}
			};
		case UNLOCK_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					unlock: false
				}
			};
		case UNLOCK_RESET:
			return {
				...state,
				error: undefined,
				unlocked: undefined,
				loading: {
					...state.loading,
					unlock: false
				}
			};
		default:
			return state;
	}
}

export function list(): ThunkResult<Promise<BaseAccount[]>> {
	return async (dispatch, getState) => {
		const state = getState();
		let accounts: BaseAccount[] = [];

		dispatch({
			type: LIST_REQUEST
		});

		try {
			let connection: EVMLC | undefined;
			const config = state.config.data;

			if (!config.storage) {
				throw Error('Configuration data not loaded.');
			}

			connection = new EVMLC(
				config.connection.host,
				config.connection.port,
				{
					from: config.defaults.from,
					gas: config.defaults.gas,
					gasPrice: config.defaults.gasPrice
				}
			);

			await connection.testConnection().catch(() => {
				connection = undefined;
			});

			const keystore = new Keystore(config.storage.keystore);

			accounts = await keystore.list(connection).catch(error => {
				dispatch({
					type: LIST_ERROR,
					payload: error.toString()
				});

				return [];
			});

			dispatch({
				type: LIST_SUCCESS,
				payload: accounts
			});
		} catch (error) {
			dispatch({
				type: LIST_ERROR,
				payload: error.toString()
			});
		}

		return accounts;
	};
}

export function create(password: string): ThunkResult<Promise<BaseAccount>> {
	return async (dispatch, getState) => {
		const state = getState();
		const config = state.config.data;

		const account: BaseAccount = {
			address: '',
			balance: 0,
			nonce: 0
		};

		dispatch({
			type: CREATE_REQUEST
		});

		try {
			if (config.storage) {
				const keystore = new Keystore(config.storage.keystore);
				const acc: V3JSONKeyStore = JSON.parse(
					await keystore.create(password).catch(error => {
						throw Error(error.toString());
					})
				);

				account.address = acc.address;

				dispatch({
					type: CREATE_SUCCESS,
					payload: account
				});
			} else {
				throw Error('Configuration could not loaded.');
			}
		} catch (error) {
			dispatch({
				type: CREATE_ERROR,
				payload: error.toString()
			});
		}

		return account;
	};
}

export function get(address: string): ThunkResult<Promise<BaseAccount>> {
	return async (dispatch, getState) => {
		const state = getState();
		const config = state.config.data;
		let account = {
			address,
			balance: '',
			nonce: 0
		};

		dispatch({
			type: GET_REQUEST
		});

		try {
			if (config.connection) {
				const connection = new EVMLC(
					config.connection.host,
					config.connection.port,
					{
						from: config.defaults.from,
						gas: config.defaults.gas,
						gasPrice: config.defaults.gasPrice
					}
				);

				account = await connection.accounts
					.getAccount(address)
					.catch(error => {
						throw Error(error.toString());
					});

				account.balance = integerWithCommas(
					account.balance
						.toString()
						.split(',')
						.join('')
				);

				dispatch({
					type: GET_SUCCESS,
					payload: account
				});
			} else {
				throw Error('Configuration could not loaded.');
			}
		} catch (error) {
			dispatch({
				type: GET_ERROR,
				payload: error.toString()
			});
		}

		return account;
	};
}

export function unlock(
	address: string,
	password: string
): ThunkResult<Promise<Account | undefined>> {
	return async (dispatch, getState) => {
		const state = getState();
		const config = state.config.data;
		let account: Account;

		dispatch({
			type: UNLOCK_REQUEST
		});

		try {
			if (config.connection) {
				let connection: EVMLC | undefined = new EVMLC(
					config.connection.host,
					config.connection.port,
					{
						from: config.defaults.from,
						gas: config.defaults.gas,
						gasPrice: config.defaults.gasPrice
					}
				);

				await connection.testConnection().catch(() => {
					connection = undefined;
				});

				const keystore = new Keystore(config.storage.keystore);
				account = await keystore.decrypt(address, password, connection);

				console.log(account);
				dispatch({
					type: UNLOCK_SUCCESS,
					payload: account
				});

				return account;
			} else {
				throw Error('Configuration could not loaded.');
			}
		} catch (error) {
			dispatch({
				type: UNLOCK_ERROR,
				payload: error.toString()
			});

			return undefined;
		}
	};
}

export function resetUnlock(): ThunkResult<void> {
	return dispatch => {
		dispatch({
			type: UNLOCK_RESET
		});
	};
}
