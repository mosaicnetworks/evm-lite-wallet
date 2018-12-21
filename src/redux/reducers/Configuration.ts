import {combineReducers} from "redux";
import {ConfigSchema} from 'evm-lite-lib';

import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Configuration, {ConfigLoadPayLoad, ConfigSavePayLoad} from "../actions/Configuration";


export type ConfigLoadType = IBasicReducer<ConfigLoadPayLoad, ConfigSchema, string>;
export type ConfigSaveType = IBasicReducer<any, string, string>;

export interface ConfigReducer {
    load: ConfigLoadType;
    save: ConfigSaveType;
}

const configuration = new Configuration();

const ConfigReducer = combineReducers({
    load: configuration.SimpleReducer<ConfigLoadPayLoad, ConfigSchema, string>('Load'),
    save: configuration.SimpleReducer<ConfigSavePayLoad, string, string>('Save'),
});

export default ConfigReducer;