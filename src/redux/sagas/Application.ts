import {put, select, takeLatest} from "redux-saga/effects";

import {DataDirectory, EVMLC} from "evm-lite-lib";

import {Store} from "..";

import Application, {AppConnectivityPayLoad} from "../actions/Application";
import Configuration from "../actions/Configuration";
import Keystore from "../actions/Keystore";


interface DirectoryChangeInitAction {
    type: string;
    payload: string;
}

interface ConnectivityCheckInitAction {
    type: string;
    payload: AppConnectivityPayLoad;
}

const app = new Application();
const config = new Configuration();
const keystore = new Keystore();

export function* dataDirectoryChangeInitWatcher() {
    yield takeLatest(app.actions.directory.init, dataDirectoryChangeInitWorker);
}

function* dataDirectoryChangeInitWorker(action: DirectoryChangeInitAction) {
    try {
        const directory = yield new DataDirectory(action.payload);

        yield put(app.handlers.directory.success('Data Directory change successful.'));
        yield console.log('[APPLICATION]', 'Created directory in ' + action.payload);

        yield put(config.handlers.load.init({
            directory: directory.path,
            name: 'config.toml'
        }))
    } catch (e) {
        yield put(app.handlers.directory.failure('Something went wrong while trying to initialize directory.'));
    }
}

export function* checkConnectivityInitWatcher() {
    yield takeLatest(app.actions.connectivity.init, checkConnectivityInitWorker);
}

function* checkConnectivityInitWorker(action: ConnectivityCheckInitAction) {
    try {
        const connection: EVMLC = yield new EVMLC(action.payload.host, action.payload.port, {
            from: '',
            gas: 0,
            gasPrice: 0
        });
        const result = yield connection.testConnection();

        if (result) {
            yield put(app.handlers.connectivity.success('A connection to a node was established.'));

            const state: Store = yield select();
            const {load} = yield state.config;

            if (load.response) {
                const list = yield load.response.storage.keystore.split('/');
                console.log(yield list.pop());

                const keystorePath = list.join('/');
                yield put(keystore.handlers.list.init({
                    directory: keystorePath,
                    name: 'keystore'
                }));
            }
        }
    } catch (e) {
        yield put(app.handlers.connectivity.failure('Something went wrong trying to connect.'));
    }

    // yield delay(2000);
    yield put(app.handlers.connectivity.reset());
}



