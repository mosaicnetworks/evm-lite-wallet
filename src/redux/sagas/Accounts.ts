import {all, put, select, takeLatest} from "redux-saga/effects";

import {Account, Keystore} from 'evm-lite-lib';

import {Store} from "..";

import Accounts, {AccountsDecryptPayload} from '../actions/Accounts';


interface AccountsDecryptAction {
    type: string,
    payload: AccountsDecryptPayload;
}

const accounts = new Accounts();

function* accountsDecryptInitWatcher() {
    yield takeLatest(accounts.actions.decrypt.init, accountsDecryptWorker);
}

function* accountsDecryptWorker(action: AccountsDecryptAction) {
    try {
        const state: Store = yield select();

        if (state.config.load.response) {
            const list = state.config.load.response.storage.keystore.split('/');
            const popped = list.pop();

            if (popped === "/") {
                list.pop();
            }

            const keystoreParentDir = list.join('/');
            const evmlKeystore = new Keystore(keystoreParentDir, 'keystore');
            const account = yield evmlKeystore.get(action.payload.address);

            yield Account.decrypt(account, action.payload.password);

            yield put(accounts.handlers.decrypt.success('Account decryption was successful.'));
        }
    } catch (e) {
        yield put(accounts.handlers.decrypt.failure('Something went wrong trying to decrypt your account.'));
    }

    // yield delay(4000);
    yield put(accounts.handlers.decrypt.reset());
}

export default function* accountsSaga() {
    yield all([accountsDecryptInitWatcher()])
}

