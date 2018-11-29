import * as path from 'path';

import {BaseAccount, Controller, Keystore} from 'evm-lite-lib';

import {Store} from "..";

import getHandlers, {EVMLActionHandler} from '../common/Handlers';
import Actions from "../common/Actions";


export interface HandlePasswordUpdateParams {
    oldPassword: string;
    newPassword: string;
    address: string;
}

class AccountsActions extends Actions {
    private keystore = new Keystore(path.join('/Users/danu/.evmlc', 'keystore'));
    private connection = new Controller('127.0.0.1');

    constructor() {
        super();
        this.TYPES = {
            FETCH_LOCAL_INIT: 'ACCOUNT_FETCH_LOCAL_INIT',
            FETCH_LOCAL_SUCCESS: 'ACCOUNT_FETCH_LOCAL_SUCCESS',
            FETCH_LOCAL_FAILURE: 'ACCOUNT_FETCH_LOCAL_FAILURE',

            CREATE_INIT: 'ACCOUNT_CREATE_INIT',
            CREATE_SUCCESS: 'ACCOUNT_CREATE_SUCCESS',
            CREATE_FAILURE: 'ACCOUNT_CREATE_FAILURE',

            UPDATE_PASSWORD_INIT: 'ACCOUNT_UPDATE_PASSWORD_INIT',
            UPDATE_PASSWORD_SUCCESS: 'ACCOUNT_UPDATE_PASSWORD_SUCCESS',
            UPDATE_PASSWORD_FAILURE: 'ACCOUNT_UPDATE_PASSWORD_FAILURE',

            EXPORT_INIT: 'ACCOUNT_EXPORT_INIT',
            EXPORT_SUCCESS: 'ACCOUNT_EXPORT_SUCCESS',
            EXPORT_FAILURE: 'ACCOUNT_EXPORT_FAILURE',

            IMPORT_INIT: 'ACCOUNT_IMPORT_INIT',
            IMPORT_SUCCESS: 'ACCOUNT_IMPORT_SUCCESS',
            IMPORT_FAILURE: 'ACCOUNT_IMPORT_FAILURE',

            TRANSFER_INIT: 'ACCOUNT_TRANSFER_INIT',
            TRANSFER_SUCCESS: 'ACCOUNT_TRANSFER_SUCCESS',
            TRANSFER_FAILURE: 'ACCOUNT_TRANSFER_FAILURE',
        };

        this.handlers = <S, F>(prefix: string) => getHandlers<AccountsActions, S, F>(this, prefix);
    }

    public handleCreateAccount: EVMLActionHandler<string, string, string, void> = data => {
        if (!data) {
            throw new Error('Data required.');
        }

        const {init, success, failure} = this.handlers<string, string>('CREATE');
        return dispatch => {
            dispatch(init());
            this.keystore
                .createWithPromise(data)
                .then((account) => {
                    setTimeout(() => dispatch(success(account)), 500);
                })
                .then(() => dispatch(this.handleFetchLocalAccounts()))
                .catch(() => dispatch(failure('Account creation unsuccessful.')));
        };
    };

    public handleAccountUpdate: EVMLActionHandler<HandlePasswordUpdateParams, string, string, void> = data => {
        if (!data) {
            throw new Error('Data required.');
        }

        const {init, success, failure} = this.handlers<string, string>('UPDATE_PASSWORD');
        return dispatch => {
            dispatch(init());
            this.keystore
                .update(data.address, data.oldPassword, data.newPassword)
                .then(() => {
                    setTimeout(() => dispatch(success('Updated account!')), 500);
                })
                .catch((err: string) => dispatch(failure(err)))
        };
    };

    public handleImportAccount: EVMLActionHandler<string, string, string, void> = data => {
        if (!data) {
            throw new Error('Data required.');
        }

        const {init, success, failure} = this.handlers<string, string>('IMPORT');
        return dispatch => {
            dispatch(init());
            this.keystore
                .importV3JSONKeystore(data)
                .then((address: string) => {
                    setTimeout(() => dispatch(success(address)), 500);
                })
                .then(() => dispatch(this.handleFetchLocalAccounts()))
                .catch(() => dispatch(failure('Something went wrong while importing an account')));
        };
    };

    public handleExportAccount: EVMLActionHandler<string, string, string, void> = (data: string) => {
        const {init, success, failure} = this.handlers<string, string>('IMPORT');
        return (dispatch) => {
            dispatch(init());
            this.keystore
                .getWithPromise(data)
                .then((v3JSONKeystoreString: string) => {
                    setTimeout(() => dispatch(success(v3JSONKeystoreString)), 500);
                })
                .catch(() => dispatch(failure('Something went wrong while exporting an account')));
        };
    };

    public handleFetchLocalAccounts: EVMLActionHandler<void, BaseAccount[], string, void> = () => {
        const {init, success, failure} = this.handlers<BaseAccount[], string>('FETCH_LOCAL');
        return (dispatch, getState: () => Store) => {
            dispatch(init());
            const keystore = new Keystore(getState().config.read.response.defaults.keystore);
            keystore
                .all(true, this.connection)
                .then((response: BaseAccount[]) => {
                    setTimeout(() => {
                        if (response.length) {
                            dispatch(success(response));
                        } else {
                            dispatch(failure('No accounts.'));
                        }
                    }, 1000)
                })
                .catch(() => dispatch(failure('Fetch local accounts promise failed.')))
        }
    };
}

export default AccountsActions
