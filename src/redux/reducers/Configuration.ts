import {combineReducers} from "redux";

import BasicReducerFactory, {ReducerState} from "../common/Reducer";

import {default as Actions} from "../actions/Configuration";


export interface ConfigReducer {
    read: ReducerState<any, string>,
    save: ReducerState<string, string>
}

const SimpleReducer = <T1, T2>(prefix: string, initial: ReducerState<T1, T2>) => BasicReducerFactory<Actions, T1, T2>(Actions, prefix, initial);

const ConfigReducer = combineReducers({
    read: SimpleReducer<any, string>('READ_CONFIG', {
        isLoading: false,
        response: null,
        error: '',
    }),
    save: SimpleReducer<string, string>('SAVE_CONFIG', {
        isLoading: false,
        response: '',
        error: ''
    }),
});

export default ConfigReducer;