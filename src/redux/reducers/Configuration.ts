import {combineReducers} from "redux";

import BasicReducerFactory, {BasicReducerState} from "../common/BasicReducer";

import {default as Actions} from "../actions/Configuration";


export interface ConfigReducer {
    read: BasicReducerState<any, string>,
    save: BasicReducerState<string, string>
}

const configuration = new Actions();
const SimpleReducer = <T1, T2>(prefix: string, initial?: BasicReducerState<T1, T2>) => BasicReducerFactory<Actions, T1, T2>(configuration, prefix, initial);

const ConfigReducer = combineReducers({
    read: SimpleReducer<any, string>('READ_CONFIG'),
    save: SimpleReducer<string, string>('SAVE_CONFIG'),
});

export default ConfigReducer;