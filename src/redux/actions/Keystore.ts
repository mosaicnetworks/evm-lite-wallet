import {Controller as Connection, Keystore} from 'evm-lite-lib';

import {BaseAccount, EVMLThunkAction} from "../index"

import Defaults from "../../classes/Defaults"
import Actions from "../common/Actions";


export interface UpdatePasswordParams {
    oldPassword: string;
    newPassword: string;
    address: string;
}

export default class KeystoreActions extends Actions {
    public path: string = Defaults.dataDirectory;
    public keystore: Keystore = new Keystore(this.path);
    public connection: Connection = new Connection('127.0.0.1', 8080);

    constructor() {
        super(KeystoreActions.name);
        this.prefixes = [
            'FETCH_LOCAL',
            'CREATE',
            'UPDATE_PASSWORD',
            'EXPORT',
            'IMPORT'
        ];
    }

    public setKeystorePath = (path: string): void => {
        this.keystore = new Keystore(path)
    };

    public handleFetch = (): EVMLThunkAction<BaseAccount[], string> => dispatch => {
        const {init, success, failure} = this.handlers<BaseAccount[], string>('FETCH_LOCAL');
        dispatch(init());

        return this.keystore
            .all(true, this.connection)
            .then((response: BaseAccount[]) => {
                response.length ?
                    dispatch(success(response)) :
                    dispatch(failure('No accounts.'));

                return response;
            })
            .catch(() => {
                dispatch(failure('Fetch local accounts promise failed.'));
                return [];
            })
    };

    public handleExport = (data: string): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('IMPORT');
        dispatch(init());

        return this.keystore
            .getWithPromise(data)
            .then((v3JSONKeystoreString: string) => {
                dispatch(success(v3JSONKeystoreString));
                return v3JSONKeystoreString
            })
            .catch(() => {
                dispatch(failure('Something went wrong while exporting an account'));
                return ''
            });
    };

    public handleImport = (data: string): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('IMPORT');
        dispatch(init());

        return this.keystore
            .importV3JSONKeystore(data)
            .then((address: string) => {
                dispatch(success(address));
                return address;
            })
            .catch(() => {
                dispatch(failure('Something went wrong while importing an account'));
                return ''
            });
    };

    public handleUpdate = (data: UpdatePasswordParams): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('UPDATE_PASSWORD');
        dispatch(init());

        return this.keystore
            .update(data.address, data.oldPassword, data.newPassword)
            .then(() => {
                dispatch(success('Updated account!'));
                return 'Updated!'
            })
            .catch((err: string) => {
                dispatch(failure(err));
                return ''
            })
    };

    public handleCreate = (data: string): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('CREATE');
        dispatch(init());

        return this.keystore
            .createWithPromise(data)
            .then((account: string) => {
                dispatch(success(account));
                return account;
            })
            .catch(() => {
                dispatch(failure('Account creation unsuccessful.'));
                return '';
            });
    };

    public handleUpdateThenFetch = (data: UpdatePasswordParams): EVMLThunkAction<BaseAccount[] | string, string> => {
        return dispatch => dispatch(this.handleUpdate(data)).then(() => dispatch(this.handleFetch()));
    };

    public handleCreateThenFetch = (data: string): EVMLThunkAction<BaseAccount[] | string, string> => {
        return dispatch => dispatch(this.handleCreate(data)).then(() => dispatch(this.handleFetch()));
    };

    public handleImportThenFetch = (data: string): EVMLThunkAction<BaseAccount[] | string, string> => {
        return dispatch => dispatch(this.handleImport(data)).then(() => dispatch(this.handleFetch()));
    };

}