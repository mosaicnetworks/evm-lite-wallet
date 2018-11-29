import {combineReducers} from "redux";

import BasicReducerFactory, {BasicReducerState} from "../common/BasicReducer";

import {default as Actions} from "../actions/App";


export interface AppReducer {
    dataDirectory: BasicReducerState<string, string>
}

const app = new Actions();
const SimpleReducer = <T1, T2>(prefix: string, initial?: BasicReducerState<T1, T2>) => BasicReducerFactory<Actions, T1, T2>(app, prefix, initial);

const AppReducer = combineReducers({
    dataDirectory: SimpleReducer<string, string>('DATA_DIRECTORY'),
});

export default AppReducer;