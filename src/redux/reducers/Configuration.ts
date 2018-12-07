import {combineReducers} from "redux";
import {BasicReducerState} from "../common/reducers/BasicReducerFactory";

import Configuration from "../actions/Configuration";


export interface ConfigReducer {
    read: BasicReducerState<any, string>,
    save: BasicReducerState<string, string>
}

const configuration = new Configuration();

const ConfigReducer = combineReducers({
    read: configuration.SimpleReducer<any, string>('READ_CONFIG'),
    save: configuration.SimpleReducer<string, string>('SAVE_CONFIG'),
});

export default ConfigReducer;