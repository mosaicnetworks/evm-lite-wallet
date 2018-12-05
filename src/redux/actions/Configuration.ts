import {Config as Configuration, ConfigSchema} from 'evm-lite-lib';

import {keystore} from "../index";
import {EVMLThunkAction} from '../common/Handlers';

import Actions from "../common/Actions";
import Defaults from "../../classes/Defaults";


export interface SaveConfigParams {
    config: ConfigSchema;
}

class ConfigurationActions extends Actions {

    public config: Configuration = new Configuration(Defaults.dataDirectory, 'config.toml');

    constructor() {
        super(ConfigurationActions.name);
        this.prefixes = [
            'READ_CONFIG',
            'SAVE_CONFIG'
        ];
    }

    public setConfigurationDataDirectory(path: string): void {
        this.config = new Configuration(path, 'config.toml');
    }

    public handleRead = (): EVMLThunkAction<ConfigSchema, string> => dispatch => {
        const {init, success, failure} = this.handlers<ConfigSchema, string>('READ_CONFIG');
        dispatch(init());

        return this.config
            .read()
            .then((config: ConfigSchema) => {
                dispatch(success(config));
                return config
            })
            .catch(() => {
                dispatch(failure('Something went wrong reading config.'));
                return {}
            });
    };

    public handleSave = (data: SaveConfigParams): EVMLThunkAction<string, string> => (dispatch) => {
        const {init, success, failure} = this.handlers<string, string>('SAVE_CONFIG');
        dispatch(init());

        return this.config
            .write(data.config)
            .then(() => {
                dispatch(success('Configuration successfully saved!'));
                return 'Saved!';
            })
            .catch(() => {
                dispatch(failure('Something went wrong reading config.'));
                return '';
            });
    };

    public handleSaveThenRefreshApp = (data: SaveConfigParams): EVMLThunkAction<string | ConfigSchema, string> => {
        return dispatch => {
            return dispatch(this.handleSave(data))
                .then(() => dispatch(this.handleRead()))
                .then((config) => {
                    if (config.defaults.keystore !== keystore.path) {
                        keystore.setKeystorePath(data.config.defaults.keystore);
                        dispatch(keystore.handleFetch());
                    }

                    return config;
                });
        }
    }

}

export default ConfigurationActions