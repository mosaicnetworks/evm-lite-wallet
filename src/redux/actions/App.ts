import {DataDirectory} from 'evm-lite-lib';

import {configuration, keystore} from "../index";

import getHandlers, {EVMLActionHandler} from "../common/Handlers";
import Actions from "../common/Actions";


export interface DataDirectoryParams {
    path: string;
}

export default class AppActions extends Actions {

    constructor() {
        super();

        // set handler function
        this.handlers = <S, F>(prefix: string) => getHandlers<AppActions, S, F>(this, prefix);

        // add simple action handlers
        this.addSimpleActionType('APPLICATION', 'DATA_DIRECTORY');
    }

    public handleDataDirectoryInit: EVMLActionHandler<DataDirectoryParams, string, string, void> = data => {
        const {init, success, failure} = this.handlers<string, string>('DATA_DIRECTORY');

        if (!data) {
            throw new Error('Parameter `data` must be provided.');
        }

        return dispatch => {
            dispatch(init());
            const directory = new DataDirectory(data.path);
            directory.checkInitialisation()
                .then(() => dispatch(success(data.path)))
                .then(() => {
                    configuration.setConfigurationDataDirectory(data.path);
                    return dispatch(configuration.handleReadConfig());
                })
                .then((config) => {
                    keystore.setKeystorePath(config.defaults.keystore);
                    dispatch(keystore.handleFetchLocalAccounts())
                })
                .catch(() => dispatch(failure('Initialisation of data directory failed.')));
        }
    };
}