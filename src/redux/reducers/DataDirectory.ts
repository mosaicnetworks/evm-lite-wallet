import { combineReducers } from 'redux';

import { IBasicReducer } from '../common/reducers/BaseReducer';

import DataDirectory from '../actions/DataDirectory';

export type DataDirectorySetReducer = IBasicReducer<string, string, string>;

export interface IDataDirectoryReducer {
	setDirectory: DataDirectorySetReducer;
}

const dataDirectory = new DataDirectory();

const DataDirectoryReducer = combineReducers({
	setDirectory: dataDirectory.actionStates.setDirectory.reducer
});

export default DataDirectoryReducer;
