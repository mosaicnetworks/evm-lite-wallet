import {put, takeLatest} from "redux-saga/effects";

import {Config, ConfigSchema} from "evm-lite-lib";

import Configuration, {ConfigLoadPayLoad} from "../actions/Configuration";
import Application from "../actions/Application";


interface ConfigFileReadAction {
    type: string;
    payload: ConfigLoadPayLoad;
}

const config = new Configuration();
const app = new Application();

export function* configFileReadInitWatcher() {
    yield takeLatest(config.actions.load.init, configFileReadInitWorker);
}

function* configFileReadInitWorker(action: ConfigFileReadAction) {
    try {
        const evmlConfig: Config = yield new Config(action.payload.directory, action.payload.name);
        const data: ConfigSchema = yield evmlConfig.load();

        yield put(config.handlers.load.success(data));
        yield console.log('[CONFIGURATION]', 'Loaded configuration from ' + action.payload);

        yield put(app.handlers.connectivity.init({
            host: data.connection.host,
            port: data.connection.port
        }));
    } catch (e) {
        yield put(config.handlers.load.failure('Something when wrong trying to load configuration data.'))
    }
}


