import {put, select, takeLatest} from "redux-saga/effects";

import {BaseAccount, EVMLC, Keystore as EVMLKeystore} from "evm-lite-lib";

import {Store} from "..";

import Keystore, {KeystoreListPayload} from "../actions/Keystore";


interface KeystoreListAction {
    type: string;
    payload: KeystoreListPayload;
}

const keystore = new Keystore();

export function* keystoreListInitWatcher() {
    yield takeLatest(keystore.actions.list.init, keystoreListInitWorker);
}

function* keystoreListInitWorker(action: KeystoreListAction) {
    try {
        const evmlKeystore: EVMLKeystore = yield new EVMLKeystore(action.payload.directory, action.payload.name);
        const state: Store = yield select();

        if (state.config.load.response && state.app.connectivity.response) {
            const {host, port} = state.config.load.response.connection;
            const connection = new EVMLC(host, port, {
                from: '',
                gas: 0,
                gasPrice: 0
            });
            const accounts: BaseAccount[] = yield evmlKeystore.list(true, connection);

            yield put(keystore.handlers.list.success(accounts));
        } else {
            yield put(keystore.handlers.list.failure('Could not connect to node.'));
        }
    } catch (e) {
        yield put(keystore.handlers.list.failure('Something went wrong fetching all accounts.'));
    }
}


