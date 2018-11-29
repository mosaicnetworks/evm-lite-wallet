import {Config} from 'evm-lite-lib';
import getHandlers, {EVMLActionHandler} from '../common/Handlers';

import Actions from "../common/Actions";
import Defaults from "../../classes/Defaults";


export interface ReadConfigParams {
    dataDirectoryPath: string;
}

export interface SaveConfigParams {
    defaults: any;
    dataDirectoryPath: string;
}

class ConfigurationActions extends Actions {
    constructor() {
        super();
        this.TYPES = {
            READ_CONFIG_INIT: 'READ_CONFIG_INIT',
            READ_CONFIG_SUCCESS: 'READ_CONFIG_SUCCESS',
            READ_CONFIG_FAILURE: 'READ_CONFIG_FAILURE',

            SAVE_CONFIG_INIT: 'SAVE_CONFIG_INIT',
            SAVE_CONFIG_SUCCESS: 'SAVE_CONFIG_SUCCESS',
            SAVE_CONFIG_FAILURE: 'SAVE_CONFIG_FAILURE',
        };

        this.handlers = <S, F>(prefix: string) => getHandlers<ConfigurationActions, S, F>(this, prefix);
    }

    public handleReadConfig: EVMLActionHandler<ReadConfigParams, any, string, void> = (data) => {
        const {init, success, failure} = this.handlers<any, string>('READ_CONFIG');

        if (!data) {
            throw new Error('Provide `data` parameter.');
        }

        return (dispatch) => {
            dispatch(init());

            data.dataDirectoryPath = data.dataDirectoryPath || Defaults.dataDirectory;
            const config = new Config(data.dataDirectoryPath, 'config.toml');

            return config
                .read()
                .then((config: any) => {
                    dispatch(success(config));
                    return config;
                })
                .catch(() => dispatch(failure('Something went wrong reading config.')));
        }
    };

    public handleSaveConfig: EVMLActionHandler<SaveConfigParams, any, string, void> = (data) => {
        const {init, success, failure} = this.handlers<string, string>('SAVE_CONFIG');

        if (!data) {
            throw new Error('Provide `data` parameter.');
        }

        return (dispatch) => {
            dispatch(init());

            const newConfig = {defaults: data.defaults};
            const dataDirectory = data.dataDirectoryPath || Defaults.dataDirectory;
            const config = new Config(dataDirectory, 'config.toml');

            return config
                .write(newConfig)
                .then(() => {
                    setTimeout(() => dispatch(success('Configuration successfully saved!')), 2000);
                })
                .then(() => {
                    dispatch(this.handleReadConfig({dataDirectoryPath: dataDirectory}));
                })
                .catch(() => dispatch(failure('Something went wrong reading config.')));
        }
    };

}

export default ConfigurationActions