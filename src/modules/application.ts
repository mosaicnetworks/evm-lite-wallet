import * as path from 'path';

import { Static, DataDirectory } from 'evm-lite-lib';

import { BaseAction, ThunkResult } from 'src/modules';
import { Store } from 'src/store';

import { list } from './accounts';
import { load } from './configuration';

const SET_DIRECTORY_SUCCESS = '@monet/application/DATADIRECTORY/SUCCESS';
const SET_DIRECTORY_ERROR = '@monet/application/DATADIRECTORY/ERROR';

// Application state structure
export interface ApplicationState {
	directory: string;
	error?: string;
}

// @ts-ignore
const defaultPath = path.join(window.require('os').homedir(), '.evmlc');

// Initial state of the application reducer
const initialState: ApplicationState = {
	directory: defaultPath || ''
};

export default function reducer(
	state: ApplicationState = initialState,
	action: BaseAction<any> = {} as BaseAction<any>
): ApplicationState {
	switch (action.type) {
		case SET_DIRECTORY_SUCCESS:
			return {
				directory: action.payload,
				error: undefined
			};
		case SET_DIRECTORY_ERROR:
			return {
				...state,
				error: action.payload
			};
		default:
			return state;
	}
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
	return async (dispatch, getState) => {
		const state: Store = getState();
		const config = state.config.data;

		if (config.storage) {
			dispatch(list());
		} else {
			dispatch(load()).then(() => dispatch(list()));
		}
	};
}
