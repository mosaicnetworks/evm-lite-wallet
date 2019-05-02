import { combineReducers } from 'redux';

import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import DataDirectory, {
	DataDirectorySetPayLoad
} from '../actions/DataDirectory';

export type DataDirectorySetReducer = IAsyncReducer<
	DataDirectorySetPayLoad,
	string,
	string
>;

export interface IDataDirectoryReducer {
	setDirectory: DataDirectorySetReducer;
}

const dataDirectory = new DataDirectory();

const DataDirectoryReducer = combineReducers({
	setDirectory: dataDirectory.actionStates.setDirectory.reducer
});

export default DataDirectoryReducer;
