import { combineReducers } from 'redux';
import { ConfigSchema } from 'evm-lite-lib';

import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import Configuration, {
	ConfigLoadPayLoad,
	ConfigSavePayLoad
} from '../actions/Config';

export type ConfigLoadReducer = IAsyncReducer<
	ConfigLoadPayLoad,
	ConfigSchema,
	string
>;
export type ConfigSaveReducer = IAsyncReducer<
	ConfigSavePayLoad,
	string,
	string
>;

export interface IConfigReducer {
	load: ConfigLoadReducer;
	save: ConfigSaveReducer;
}

const configuration = new Configuration();

const ConfigReducer = combineReducers({
	load: configuration.actionStates.load.reducer,
	save: configuration.actionStates.save.reducer
});

export default ConfigReducer;
