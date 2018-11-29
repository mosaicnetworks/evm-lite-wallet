import {DataDirectory} from 'evm-lite-lib';

import {configuration} from "../index";

import getHandlers, {EVMLActionHandler} from "../common/Handlers";
import Actions from "../common/Actions";


export interface DataDirectoryParams {
    path: string;
}

export default class AppActions extends Actions {

    constructor() {
        super();
        this.handlers = <S, F>(prefix: string) => getHandlers<AppActions, S, F>(this, prefix)
        this.TYPES = {
            DATA_DIRECTORY_INIT: "APP_DATA_DIRECTORY_INIT",
            DATA_DIRECTORY_SUCCESS: "APP_DATA_DIRECTORY_SUCCESS",
            DATA_DIRECTORY_FAILURE: "APP_DATA_DIRECTORY_FAILURE",
        }
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
                .then(() => dispatch(configuration.handleReadConfig({dataDirectoryPath: data.path})))
                .catch(() => dispatch(failure('Initialisation of data directory failed.')));
        }
    };
}