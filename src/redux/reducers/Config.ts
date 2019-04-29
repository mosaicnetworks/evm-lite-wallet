import { combineReducers } from 'redux';
import { ConfigSchema } from 'evm-lite-lib';

import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Configuration, {
	ConfigLoadPayLoad,
	ConfigSavePayLoad
} from '../actions/Config';

export type ConfigLoadReducer = IBasicReducer<
	ConfigLoadPayLoad,
	ConfigSchema,
	string
>;
export type ConfigSaveReducer = IBasicReducer<any, string, string>;

export interface IConfigReducer {
	load: ConfigLoadReducer;
	save: ConfigSaveReducer;
}

const configuration = new Configuration();

const ConfigReducer = combineReducers({
	load: configuration.SimpleReducer<ConfigLoadPayLoad, ConfigSchema, string>(
		'Load'
	),
	save: configuration.SimpleReducer<ConfigSavePayLoad, string, string>('Save')
});

export default ConfigReducer;
