import { all, takeLatest } from 'redux-saga/effects';

import { dataDirectorySetWorker } from '../workers/DataDirectory';

import DataDirectoryActions from '../../actions/DataDirectory';

const dataDirectory = new DataDirectoryActions();

function* dataDirectorySetWatcher() {
	yield takeLatest(
		dataDirectory.actions.setDirectory.init,
		dataDirectorySetWorker
	);
}

export default function*() {
	yield all([dataDirectorySetWatcher()]);
}
