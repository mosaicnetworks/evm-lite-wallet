import {combineReducers} from "redux";
import {ConfigSchema} from 'evm-lite-lib';

import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Configuration from "../actions/Configuration";


export type ReadConfigReducer = IBasicReducer<ConfigSchema, string>;
export type SaveConfigReducer = IBasicReducer<string, string>;

export interface ConfigReducer {
    read: ReadConfigReducer;
    save: SaveConfigReducer;
}

const configuration = new Configuration();

const ConfigReducer = combineReducers({
    read: configuration.SimpleReducer<any, string>('Detail'),
    save: configuration.SimpleReducer<string, string>('Update'),
});

export default ConfigReducer;