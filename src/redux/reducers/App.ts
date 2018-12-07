import {combineReducers} from "redux";
import {BasicReducerState} from "../common/reducers/BasicReducerFactory";

import Application from "../actions/App";


export interface AppReducer {
    dataDirectory: BasicReducerState<string, string>
}

const app = new Application();

const AppReducer = combineReducers({
    dataDirectory: app.SimpleReducer<string, string>('Directory'),
});

export default AppReducer;