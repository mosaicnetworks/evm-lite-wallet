import * as path from 'path';

import {BaseAccount, Controller, Keystore} from 'evm-lite-lib';

import Actions from "../common/Actions";
import getHandlers, {EVMLActionHandler} from '../common/Handlers';
import {Store} from "..";


export interface HandlePasswordUpdateParams {
    oldPassword: string;
    newPassword: string;
    address: string;
}

class AccountsActions extends Actions {

    public static TYPES = {
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

    public static handleFetchLocalAccounts: EVMLActionHandler<void, BaseAccount[], string> = () => {
        const {init, success, failure} = AccountsActions.handlers('FETCH_LOCAL');
        return (dispatch, getState: () => Store) => {
            dispatch(init());
            const keystore = new Keystore(getState().config.read.response.defaults.keystore);
            keystore
                .all(true, AccountsActions.connection)
                .then((response: BaseAccount[]) => {
                    setTimeout(() => {
                        if (response.length) {
                            dispatch(success<BaseAccount[]>(response));
                        } else {
                            dispatch(failure<string>('No accounts.'));
                        }
                    }, 1000)
                })
                .catch(() => dispatch(failure<string>('Fetch local accounts promise failed.')))
        }
    };

    public static handleCreateAccount: EVMLActionHandler<string, string, string> = data => {
        if (!data) {
            throw new Error('Data required.');
        }

        const {init, success, failure} = AccountsActions.handlers('CREATE');
        return dispatch => {
            dispatch(init());
            AccountsActions.keystore
                .createWithPromise(data)
                .then((account) => {
                    setTimeout(() => dispatch(success<string>(account)), 500);
                })
                .then(() => dispatch(AccountsActions.handleFetchLocalAccounts()))
                .catch(() => dispatch(failure<string>('Account creation unsuccessful.')));
        };
    };

    public static handleAccountUpdate: EVMLActionHandler<HandlePasswordUpdateParams, string, string> = data => {
        if (!data) {
            throw new Error('Data required.');
        }

        const {init, success, failure} = AccountsActions.handlers('UPDATE_PASSWORD');
        return dispatch => {
            dispatch(init());
            AccountsActions.keystore
                .update(data.address, data.oldPassword, data.newPassword)
                .then(() => {
                    setTimeout(() => dispatch(success<string>('Updated account!')), 500);
                })
                .catch((err: string) => dispatch(failure<string>(err)))
        };
    };

    public static handleImportAccount: EVMLActionHandler<string, string, string> = data => {
        if (!data) {
            throw new Error('Data required.');
        }

        const {init, success, failure} = AccountsActions.handlers('IMPORT');
        return dispatch => {
            dispatch(init());
            AccountsActions.keystore
                .importV3JSONKeystore(data)
                .then((address: string) => {
                    setTimeout(() => dispatch(success<string>(address)), 500);
                })
                .then(() => dispatch(AccountsActions.handleFetchLocalAccounts()))
                .catch(() => dispatch(failure<string>('Something went wrong while importing an account')));
        };
    };

    public static handleExportAccount: EVMLActionHandler<string, string, string> = (data: string) => {
        const {init, success, failure} = AccountsActions.handlers('IMPORT');
        return (dispatch) => {
            dispatch(init());
            AccountsActions.keystore
                .getWithPromise(data)
                .then((v3JSONKeystoreString: string) => {
                    setTimeout(() => dispatch(success<string>(v3JSONKeystoreString)), 500);
                })
                .catch(() => dispatch(failure<string>('Something went wrong while exporting an account')));
        };
    };

    private static keystore = new Keystore(path.join('/Users/danu/.evmlc', 'keystore'));
    private static connection = new Controller('127.0.0.1');
    private static handlers = (prefix: string) => getHandlers<AccountsActions>(AccountsActions, prefix)
}

export default AccountsActions
