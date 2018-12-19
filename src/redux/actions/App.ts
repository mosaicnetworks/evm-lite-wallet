import {BaseAccount, DataDirectory} from 'evm-lite-lib';

import {configuration, EVMLThunkAction, keystore, transaction} from "../index";

import Actions from "../common/BaseActions";


export interface DataDirectoryParams {
    path: string;
}

export default class Application extends Actions {

    constructor() {
        super(Application.name);
        this.prefixes = ['Directory'];
    }

    public handleDataDirectoryInit = (data: DataDirectoryParams): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('Directory');
        dispatch(init());

        return Promise.resolve()
            .then(() => {
                const directory = new DataDirectory(data.path);
                dispatch(success(directory.path));
                return 'Initialised';
            })
            .catch(() => {
                dispatch(failure('Initialisation of data directory failed.'));
                return '';
            });
    };

    public handleDataDirInitThenPopulateApp = (data: DataDirectoryParams): EVMLThunkAction<BaseAccount[] | string, string> => dispatch => {
        return dispatch(this.handleDataDirectoryInit(data))
            .then(() => {
                configuration.setConfigurationDataDirectory(data.path);
                return dispatch(configuration.handleRead());
            })
            .then((config) => {
                keystore.setNewDataDirectory(config.storage.keystore);
                return dispatch(keystore.handleFetch())
            })
            .then(() => {
                return dispatch(transaction.handleListTransactionHistories(data.path))
            })
    };
}