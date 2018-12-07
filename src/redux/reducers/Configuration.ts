import {combineReducers} from "redux";
import {ConfigSchema} from 'evm-lite-lib';

import {BasicReducerState} from "../common/reducers/BasicReducerFactory";

import Configuration from "../actions/Configuration";


export interface ConfigReducer {
    read: BasicReducerState<ConfigSchema, string>,
    save: BasicReducerState<string, string>
}

const configuration = new Configuration();

const ConfigReducer = combineReducers({
    read: configuration.SimpleReducer<any, string>('Detail'),
    save: configuration.SimpleReducer<string, string>('Update'),
});

export default ConfigReducer;