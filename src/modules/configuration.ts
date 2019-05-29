import { Config, ConfigSchema } from 'evm-lite-lib';

import { BaseAction, ThunkResult } from 'src/modules';
import { Store } from 'src/store';

// Load configuration from data directory
const LOAD_REQUEST = '@monet/configuration/LOAD/REQUEST';
const LOAD_SUCCESS = '@monet/configuration/LOAD/SUCCESS';
const LOAD_ERROR = '@monet/configuration/LOAD/ERROR';

export interface ConfigurationState {
	data: ConfigSchema;
	error?: string;
	loading: {
		load: boolean;
		save: boolean;
	};
}

const initialState: ConfigurationState = {
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
		default:
			return state;
	}
}

export function load(): ThunkResult<Promise<ConfigSchema>> {
	return async (dispatch, getState) => {
		const state: Store = getState();
		let config: ConfigSchema = {} as ConfigSchema;

		dispatch({
			type: LOAD_REQUEST
		});

		try {
			const configuration = new Config(
				`${state.app.directory}/config.toml`
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
