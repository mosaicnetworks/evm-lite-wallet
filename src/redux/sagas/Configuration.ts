import {all, fork, join, put, takeLatest} from "redux-saga/effects";

import {Config, ConfigSchema} from "evm-lite-lib";

import Configuration, {ConfigLoadPayLoad, ConfigSavePayLoad} from "../actions/Configuration";
import Keystore from "../actions/Keystore";
import {keystoreListWorker} from "./Keystore";


interface ConfigFileLoadAction {
    type: string;
    payload: ConfigLoadPayLoad;
}

interface ConfigFileSaveAction {
    type: string;
    payload: ConfigSavePayLoad;
}

const config = new Configuration();
const keystore = new Keystore();

function* configurationReadInitWatcher() {
    yield takeLatest(config.actions.load.init, configurationReadWorker);
}

function* configurationSaveInitWatcher() {
    yield takeLatest(config.actions.save.init, configurationSaveWorker);
}

export function* configurationReadWorker(action: ConfigFileLoadAction) {
    try {
        const evmlConfig: Config = yield new Config(action.payload.directory, action.payload.name);
        const data: ConfigSchema = yield evmlConfig.load();

        yield put(config.handlers.load.success(data));

        return data;
    } catch (e) {
        yield put(config.handlers.load.failure('Something when wrong trying to load configuration data.'));

        return null;
    }
}

export function* configurationSaveWorker(action: ConfigFileSaveAction) {
    try {
        const evmlConfig: Config = yield new Config(action.payload.directory, action.payload.name);
        const response: string = yield evmlConfig.save(action.payload.configSchema);

        yield put(config.handlers.save.success(response));

        const configurationData: ConfigSchema = yield join(
            yield fork(configurationReadWorker, config.handlers.load.init({
                directory: action.payload.directory,
                name: action.payload.name
            }))
        );

        if (configurationData) {
            const list = configurationData.storage.keystore.split('/');
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

        return true
    } catch (e) {
        console.log(e);
        yield put(config.handlers.save.failure('Something when wrong trying to save configuration data.'));

        return null;
    }
}


export default function* configurationSagas() {
    yield all([configurationReadInitWatcher(), configurationSaveInitWatcher()]);
}
