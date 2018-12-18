import {EVMLC as Connection, Keystore} from 'evm-lite-lib';

import {BaseAccount, EVMLThunkAction} from "../index"

import Defaults from "../../classes/Defaults"
import Actions from "../common/BaseActions";


export interface UpdatePasswordParams {
    oldPassword: string;
    newPassword: string;
    address: string;
}

export default class KeystoreActions extends Actions {
    public path: string = Defaults.dataDirectory;
    public keystore: Keystore = new Keystore(this.path, 'keystore');
    private connection = new Connection('127.0.0.1', 8080, {
        from: '',
        gas: 0,
        gasPrice: 1
    });

    constructor() {
        super(KeystoreActions.name);
        this.prefixes = [
            'List',
            'Create',
            'Update',
            'Export',
            'Import'
        ];
    }

    public setNewDataDirectory = (path: string): void => {
        const list = path.split('/');
        list.pop();

        const dataDirectory = list.join('/');
        this.keystore = new Keystore(dataDirectory, 'keystore')
    };

    public handleFetch = (): EVMLThunkAction<BaseAccount[], string> => dispatch => {
        const {init, success, failure} = this.handlers<BaseAccount[], string>('List');
        dispatch(init());

        return this.keystore
            .list(true, this.connection)
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

    public handleExport = (address: string): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('Export');
        dispatch(init());

        return this.keystore
            .get(address)
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
        const {init, success, failure} = this.handlers<string, string>('Import');
        dispatch(init());

        return this.keystore
            .import(data)
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
        const {init, success, failure} = this.handlers<string, string>('Update');
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
        const {init, success, failure} = this.handlers<string, string>('Create');
        dispatch(init());

        return this.keystore
            .create(data)
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