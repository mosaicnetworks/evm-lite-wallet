import { combineReducers } from 'redux';

import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import DataDirectory from '../actions/DataDirectory';

export type DataDirectorySetReducer = IBasicReducer<string, string, string>;

export interface IDataDirectoryReducer {
	setDirectory: DataDirectorySetReducer;
}

const dataDirectory = new DataDirectory();

const DataDirectoryReducer = combineReducers({
	setDirectory: dataDirectory.SimpleReducer<string, string, string>(
		'SetDirectory'
	)
});

export default DataDirectoryReducer;
