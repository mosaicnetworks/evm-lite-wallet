import {Config as Configuration, ConfigSchema} from 'evm-lite-lib';

import {keystore, EVMLThunkAction} from "../index";

import Defaults from "../../classes/Defaults";
import Actions from "../common/BaseActions";


export interface SaveConfigParams {
    config: ConfigSchema;
}

class ConfigurationActions extends Actions {

    public config: Configuration = new Configuration(Defaults.dataDirectory, 'config.toml');

    constructor() {
        super(ConfigurationActions.name);
        this.prefixes = [
            'Detail',
            'Update'
        ];
    }

    public setConfigurationDataDirectory(path: string): void {
        this.config = new Configuration(path, 'config.toml');
    }

    public handleRead = (): EVMLThunkAction<ConfigSchema, string> => dispatch => {
        const {init, success, failure} = this.handlers<ConfigSchema, string>('Detail');
        dispatch(init());

        return this.config
            .load()
            .then((config: ConfigSchema) => {
                dispatch(success(config));
                return config
            })
            .catch(() => {
                dispatch(failure('Something went wrong reading config.'));
                return this.config.default()
            });
    };

    public handleSave = (data: SaveConfigParams): EVMLThunkAction<string, string> => (dispatch) => {
        const {init, success, failure} = this.handlers<string, string>('Update');
        dispatch(init());

        return this.config
            .save(data.config)
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
                .then(async (config) => {
                    if (config.storage.keystore !== keystore.path) {
                        keystore.setNewDataDirectory(data.config.storage.keystore);
                        await dispatch(keystore.handleFetch());
                    }

                    return config;
                });
        }
    }

}

export default ConfigurationActions