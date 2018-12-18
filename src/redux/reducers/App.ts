import {combineReducers} from "redux";
import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Application from "../actions/App";

export type DataDirectoryAppReducer = IBasicReducer<string, string>;

export interface AppReducer {
    dataDirectory: DataDirectoryAppReducer;
}

const app = new Application();

const AppReducer = combineReducers({
    dataDirectory: app.SimpleReducer<string, string>('Directory'),
});

export default AppReducer;