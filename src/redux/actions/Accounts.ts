import * as path from 'path';

import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";

import {BaseAccount, Controller} from 'evml-client';
import {Keystore, Static} from 'evml-cli';

import {Store} from "..";

import Actions from "../common/Actions";
import getHandlers from '../common/ActionCreator';


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
    };

    public static handleFetchLocalAccounts = (): ThunkAction<void, Store, any, AnyAction> => {
        const {init, success, failure} = AccountsActions.handlers('FETCH_LOCAL');

        return (dispatch) => {
            dispatch(init());
            AccountsActions.keystore
                .all(true, AccountsActions.connection)
                .then((response: BaseAccount[]) => {
                    if (response.length) {
                        dispatch(success<BaseAccount[]>(response));
                    } else {
                        dispatch(failure<string>('No accounts.'));
                    }
                })
                .catch(() => dispatch(failure<string>('Fetch local accounts promise failed.')))
        }
    };

    public static handleCreateAccount = (password: string): ThunkAction<void, Store, any, AnyAction> => {
        const {init, success, failure} = AccountsActions.handlers('CREATE');
        return dispatch => {
            dispatch(init());
            AccountsActions.keystore
                .createWithPromise(password)
                .then((account) => {
                    setTimeout(() => dispatch(success<string>(account)), 1000);
                })
                .catch(() => dispatch(failure<string>('Account creation unsuccessful.')));
        };
    };

    public static handleUpdateAccountPassword = (address: string, oldPass: string, newPass: string): ThunkAction<void, Store, any, AnyAction> => {
        const {init, success, failure} = AccountsActions.handlers('UPDATE_PASSWORD');

        return (dispatch) => {
            dispatch(init());
            AccountsActions.keystore
                .update(address, oldPass, newPass)
                .then(() => {
                    setTimeout(() => dispatch(success<string>('Successfully updated account!')), 1000);

                })
                .catch((err: string) => dispatch(failure<string>(err)))
        };
    };

    private static keystore = new Keystore(path.join(Static.evmlcDirElectron, 'keystore'));
    private static connection = new Controller('127.0.0.1');
    private static handlers = (prefix: string) => getHandlers<AccountsActions>(AccountsActions, prefix)
}

export default AccountsActions