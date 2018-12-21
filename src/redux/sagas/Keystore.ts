import {all, fork, join, put, select, takeLatest} from "redux-saga/effects";

import {BaseAccount, Keystore as EVMLKeystore} from "evm-lite-lib";

import {Store} from "..";
import {checkConnectivityWorker} from "./Application";

import Keystore, {KeystoreListPayload} from "../actions/Keystore";
import Transactions from "../actions/Transactions";
import Application from "../actions/Application";


interface KeystoreListAction {
    type: string;
    payload: KeystoreListPayload;
}

const keystore = new Keystore();
const transactions = new Transactions();
const app = new Application();

function* keystoreListInitWatcher() {
    yield takeLatest(keystore.actions.list.init, keystoreListWorker);
}

export function* keystoreListWorker(action: KeystoreListAction) {
    try {
        const evmlKeystore: EVMLKeystore = yield new EVMLKeystore(action.payload.directory, action.payload.name);
        const state: Store = yield select();

        let fetch: boolean = false;
        let connection: any;

        if (state.config.load.response) {
            const connected = yield join(
                yield fork(checkConnectivityWorker, app.handlers.connectivity.init({
                    host: state.config.load.response.connection.host,
                    port: state.config.load.response.connection.port
                }))
            );

            if (connected) {
                fetch = true;
                connection = connected;
            }
        }

        const accounts: BaseAccount[] = yield evmlKeystore.list(fetch, connection || null);
        yield put(keystore.handlers.list.success(accounts));

        yield put(transactions.handlers.history.init({
            addresses: accounts.map((account) => account.address)
        }))
    } catch (e) {
        yield put(keystore.handlers.list.failure('Something went wrong fetching all accounts.'));
    }
}

export default function* keystoreSagas() {
    yield all([keystoreListInitWatcher()]);
}



