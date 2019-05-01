import { combineReducers } from 'redux';
import { ConfigSchema } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BaseReducer';

import Configuration, {
	ConfigLoadPayLoad,
	ConfigSavePayLoad
} from '../actions/Config';

export type ConfigLoadReducer = IBasicReducer<
	ConfigLoadPayLoad,
	ConfigSchema,
	string
>;
export type ConfigSaveReducer = IBasicReducer<
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
