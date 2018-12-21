import {all, fork, join, put, takeLatest} from "redux-saga/effects";

import {ConfigSchema, DataDirectory, EVMLC} from "evm-lite-lib";

import {configurationReadWorker} from "./Configuration";
import {keystoreListWorker} from "./Keystore";

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

function* dataDirectoryChangeInitWatcher() {
    yield takeLatest(app.actions.directory.init, dataDirectoryChangeWorker);
}

export function* dataDirectoryChangeWorker(action: DirectoryChangeInitAction) {
    try {
        const directory = yield new DataDirectory(action.payload);
        yield put(app.handlers.directory.success('Data Directory change successful.'));

        const configurationForkData: ConfigSchema = yield join(
            yield fork(configurationReadWorker, config.handlers.load.init({
                directory: directory.path,
                name: 'config.toml'
            }))
        );

        if (configurationForkData) {
            const list = configurationForkData.storage.keystore.split('/');
            const popped = list.pop();

            if (popped === "/") {
                list.pop();
            }

            const keystoreParentDir = list.join('/');

            yield join(
                yield fork(keystoreListWorker, keystore.handlers.list.init({
                    directory: keystoreParentDir,
                    name: 'keystore'
                }))
            );
        }
    } catch (e) {
        yield put(app.handlers.directory.failure('Something went wrong while trying to initialize directory.'));
    }
}

function* checkConnectivityInitWatcher() {
    yield takeLatest(app.actions.connectivity.init, checkConnectivityWorker);
}

export function* checkConnectivityWorker(action: ConnectivityCheckInitAction) {
    try {
        const connection: EVMLC = new EVMLC(action.payload.host, action.payload.port, {
            from: '',
            gas: 0,
            gasPrice: 0
        });

        const result: boolean = yield connection.testConnection();

        if (result) {
            yield put(app.handlers.connectivity.success('A connection to a node was established.'));
            yield put(app.handlers.connectivity.reset());

            return connection;
        }
    } catch (e) {
        yield put(app.handlers.connectivity.failure('Something went wrong trying to connect.'));
        yield put(app.handlers.connectivity.reset());

        return null;
    }

}

export default function* applicationSagas() {
    yield all([checkConnectivityInitWatcher(), dataDirectoryChangeInitWatcher()]);
}




