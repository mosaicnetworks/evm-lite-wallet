import {combineReducers} from "redux";
import {ConfigSchema} from 'evm-lite-lib';

import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Configuration, {ConfigLoadPayLoad} from "../actions/Configuration";


export type LoadConfigReducer = IBasicReducer<ConfigLoadPayLoad, ConfigSchema, string>;
// export type SaveConfigReducer = IBasicReducer<any, string, string>;

export interface ConfigReducer {
    load: LoadConfigReducer;
    // save: SaveConfigReducer;
}

const configuration = new Configuration();

const ConfigReducer = combineReducers({
    load: configuration.SimpleReducer<ConfigLoadPayLoad, ConfigSchema, string>('Load'),
    // save: configuration.SimpleReducer<string, string>('Update'),
});

export default ConfigReducer;