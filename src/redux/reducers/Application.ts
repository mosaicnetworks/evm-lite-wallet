import {combineReducers} from "redux";
import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Application, {AppConnectivityPayLoad} from "../actions/Application";


export type DataDirectoryAppReducer = IBasicReducer<string, string, string>;
export type ConnectivityAppReducer = IBasicReducer<AppConnectivityPayLoad, string, string>;

export interface AppReducer {
    directory: DataDirectoryAppReducer;
    connectivity: ConnectivityAppReducer;
}

const app = new Application();

const AppReducer = combineReducers({
    directory: app.SimpleReducer<string, string, string>('Directory'),
    connectivity: app.SimpleReducer<AppConnectivityPayLoad, string, string>('Connectivity')
});

export default AppReducer;