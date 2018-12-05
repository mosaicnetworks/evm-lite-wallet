import {BaseAccount, DataDirectory} from 'evm-lite-lib';

import {configuration, keystore} from "../index";
import {EVMLThunkAction} from "../common/Handlers";

import Actions from "../common/Actions";


export interface DataDirectoryParams {
    path: string;
}

export default class Application extends Actions {

    constructor() {
        super(Application.name);
        this.prefixes = ['DATA_DIRECTORY'];
    }

    public handleDataDirectoryInit = (data: DataDirectoryParams): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('DATA_DIRECTORY');
        const directory = new DataDirectory(data.path);
        dispatch(init());

        return directory.checkInitialisation()
            .then(() => {
                dispatch(success(data.path));
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
                keystore.setKeystorePath(config.defaults.keystore);
                return dispatch(keystore.handleFetch())
            })
    };
}