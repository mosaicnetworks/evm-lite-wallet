import { BaseAccount, Keystore, V3JSONKeyStore } from 'evm-lite-lib';

import { Store } from 'src/store';
import { BaseAction, ThunkResult } from 'src/modules';

// Lists all accounts in keystore
const LIST_REQUEST = '@monet/accounts/LIST/REQUEST';
const LIST_SUCCESS = '@monet/accounts/LIST/SUCCESS';
const LIST_ERROR = '@monet/accounts/LIST/ERROR';

// Creates account in keystore
const CREATE_REQUEST = '@monet/accounts/CREATE/REQUEST';
const CREATE_SUCCESS = '@monet/accounts/CREATE/SUCCESS';
const CREATE_ERROR = '@monet/accounts/CREATE/ERROR';

// const UNLOCK = 'monet/accounts/UNLOCK'; // For decrypting an account
// const GET = 'monet/accounts/GET'; // Get account balance and nonce from node

// Accounts state structure
export interface AccountsState {
	accounts: any[];
	error?: string;
	loading: {
		list: boolean;
		get: boolean;
		create: boolean;
		unlock: boolean;
	};
}

const initialState: AccountsState = {
	accounts: [],
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
				accounts: [],
				error: undefined,
				loading: {
					...state.loading,
					list: true
				}
			};
		case LIST_SUCCESS:
			return {
				accounts: action.payload,
				loading: {
					...state.loading,
					list: false
				}
			};
		case LIST_ERROR:
			return {
				...state,
				accounts: [],
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
				accounts: [...state.accounts, action.payload],
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

		default:
			return state;
	}
}

export function list(): ThunkResult<Promise<BaseAccount[]>> {
	return async (dispatch, getState) => {
		const state: Store = getState();
		let accounts: BaseAccount[] = [];

		dispatch({
			type: LIST_REQUEST
		});

		try {
			const config = state.config.config;

			if (!config.storage) {
				throw Error('Configuration data not loaded.');
			}

			const keystore = new Keystore(config.storage.keystore);
			accounts = await keystore.list().catch(error => {
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
		const state: Store = getState();
		const config = state.config.config;

		const account: BaseAccount = {
			address: '',
			balance: 0,
			nonce: 0
		};

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
