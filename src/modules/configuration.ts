import * as path from 'path';

import { Config, ConfigSchema, DataDirectory, Static } from 'evm-lite-lib';

import { BaseAction, ThunkResult } from 'src/modules';
import { Store } from 'src/store';

import { list } from './accounts';

// Set configuration data directory
const SET_DIRECTORY_SUCCESS = '@monet/configuration/DATADIRECTORY/SUCCESS';
const SET_DIRECTORY_ERROR = '@monet/configuration/DATADIRECTORY/ERROR';

// Load configuration from data directory
const LOAD_REQUEST = '@monet/configuration/LOAD/REQUEST';
const LOAD_SUCCESS = '@monet/configuration/LOAD/SUCCESS';
const LOAD_ERROR = '@monet/configuration/LOAD/ERROR';

// Save configuration
const SAVE_REQUEST = '@monet/configuration/SAVE/REQUEST';
const SAVE_SUCCESS = '@monet/configuration/SAVE/SUCCESS';
const SAVE_ERROR = '@monet/configuration/SAVE/ERROR';

// @ts-ignore - The default path for the data directory if none is set.
const defaultPath = path.join(window.require('os').homedir(), '.evmlc');

export interface ConfigurationState {
	// The data directory path
	readonly directory: string;

	// The configuration data values
	readonly data: ConfigSchema;

	// This error attribute is used by all actions
	readonly error?: string;

	// Loading states for all actions
	readonly loading: {
		load: boolean;
		save: boolean;
	};
}

const initialState: ConfigurationState = {
	directory: defaultPath,
	data: {} as ConfigSchema,
	loading: {
		load: false,
		save: false
	}
};

export default function reducer(
	state: ConfigurationState = initialState,
	action: BaseAction<any> = {} as BaseAction<any>
): ConfigurationState {
	switch (action.type) {
		// Set data directory
		case SET_DIRECTORY_SUCCESS:
			return {
				...state,
				directory: action.payload,
				error: undefined
			};
		case SET_DIRECTORY_ERROR:
			return {
				...state,
				error: action.payload
			};

		// Load configuration
		case LOAD_REQUEST:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					load: true
				}
			};
		case LOAD_SUCCESS:
			return {
				...state,
				data: action.payload,
				loading: {
					...state.loading,
					load: false
				}
			};

		case LOAD_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					load: false
				}
			};

		// Save configuration
		case SAVE_REQUEST:
			return {
				...state,
				error: undefined,
				loading: {
					...state.loading,
					save: true
				}
			};
		case SAVE_SUCCESS:
			return {
				...state,
				data: action.payload,
				loading: {
					...state.loading,
					save: false
				}
			};
		case SAVE_ERROR:
			return {
				...state,
				error: action.payload,
				loading: {
					...state.loading,
					save: false
				}
			};
		default:
			return state;
	}
}

export function load(): ThunkResult<Promise<ConfigSchema>> {
	return async (dispatch, getState) => {
		const state: Store = getState();
		let config = {} as ConfigSchema;

		dispatch({
			type: LOAD_REQUEST
		});

		try {
			const configuration = new Config(
				`${state.config.directory}/config.toml`
			);

			config = await configuration.load();

			dispatch({
				type: LOAD_SUCCESS,
				payload: config
			});
		} catch (error) {
			dispatch({
				type: LOAD_ERROR,
				payload: error.toString()
			});
		}

		return config;
	};
}

export function setDirectory(path: string): ThunkResult<Promise<string>> {
	return async dispatch => {
		if (Static.exists(path) && !Static.isDirectory(path)) {
			dispatch({
				type: SET_DIRECTORY_ERROR,
				payload: `Provided path '${path}' is not a directory.`
			});

			return path;
		}

		const _ = new DataDirectory(path);
		console.log(_.path);

		dispatch({
			type: SET_DIRECTORY_SUCCESS,
			payload: path
		});

		dispatch(load()).then(() => dispatch(list()));

		return path;
	};
}

export function initialize(): ThunkResult<Promise<void>> {
	return async dispatch => {
		dispatch(load()).then(() => dispatch(list()));
	};
}

export function save(
	newConfig: ConfigSchema
): ThunkResult<Promise<ConfigSchema>> {
	return async (dispatch, getState) => {
		const state: Store = getState();

		dispatch({
			type: SAVE_REQUEST
		});

		try {
			const configuration = new Config(
				`${state.config.directory}/config.toml`
			);

			await configuration.save(newConfig);

			dispatch({
				type: SAVE_SUCCESS,
				payload: newConfig
			});

			return newConfig;
		} catch (error) {
			dispatch({
				type: LOAD_ERROR,
				payload: error.toString()
			});

			return {} as ConfigSchema;
		}
	};
}
