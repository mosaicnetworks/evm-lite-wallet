import {Controller as Connection, Keystore} from 'evm-lite-lib';

import {BaseAccount} from "../"
import getHandlers, {EVMLThunkAction} from "../common/Handlers";

import Defaults from "../../classes/Defaults"
import Actions from "../common/Actions";


export interface UpdatePasswordParams {
    oldPassword: string;
    newPassword: string;
    address: string;
}

export default class KeystoreActions extends Actions {

    public keystore: Keystore;
    public connection: Connection;

    constructor(public path: string = Defaults.dataDirectory) {
        super();

        // set handler function
        this.handlers = <S, F>(prefix: string) => getHandlers<KeystoreActions, S, F>(this, prefix);

        // generate keystore instance
        this.keystore = new Keystore(this.path);
        this.connection = new Connection('127.0.0.1', 8080);

        // add simple action handlers
        this.addSimpleActionType('KEYSTORE', 'FETCH_LOCAL');
        this.addSimpleActionType('KEYSTORE', 'CREATE');
        this.addSimpleActionType('KEYSTORE', 'UPDATE_PASSWORD');
        this.addSimpleActionType('KEYSTORE', 'EXPORT');
        this.addSimpleActionType('KEYSTORE', 'IMPORT');
    }

    public setKeystorePath = (path: string): void => {
        this.keystore = new Keystore(path)
    };

    public handleFetchLocalAccounts = (): EVMLThunkAction<BaseAccount[], string, void> => dispatch => {
        const {init, success, failure} = this.handlers<BaseAccount[], string>('FETCH_LOCAL');
        dispatch(init());

        this.keystore
            .all(true, this.connection)
            .then((response: BaseAccount[]) => {
                response.length ? dispatch(success(response)) : dispatch(failure('No accounts.'))
            })
            .catch(() => dispatch(failure('Fetch local accounts promise failed.')))
    };

    public handleExportAccount = (data: string): EVMLThunkAction<string, string, void> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('IMPORT');
        dispatch(init());
        this.keystore
            .getWithPromise(data)
            .then((v3JSONKeystoreString: string) => dispatch(success(v3JSONKeystoreString)))
            .catch(() => dispatch(failure('Something went wrong while exporting an account')));
    };

    public handleImportAccount = (data: string): EVMLThunkAction<string, string, void> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('IMPORT');
        dispatch(init());
        this.keystore
            .importV3JSONKeystore(data)
            .then((address: string) => dispatch(success(address)))
            .then(() => dispatch(this.handleFetchLocalAccounts()))
            .catch(() => dispatch(failure('Something went wrong while importing an account')));
    };

    public handleAccountUpdate = (data: UpdatePasswordParams): EVMLThunkAction<string, string, void> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('UPDATE_PASSWORD');
        dispatch(init());
        this.keystore
            .update(data.address, data.oldPassword, data.newPassword)
            .then(() => dispatch(success('Updated account!')))
            .catch((err: string) => dispatch(failure(err)))
    };

    public handleCreateAccount = (data: string): EVMLThunkAction<string, string, void> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('CREATE');
        dispatch(init());
        this.keystore
            .createWithPromise(data)
            .then((account) => dispatch(success(account)))
            .then(() => dispatch(this.handleFetchLocalAccounts()))
            .catch(() => dispatch(failure('Account creation unsuccessful.')));
    };

}