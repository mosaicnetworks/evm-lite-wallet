import {Config as Configuration, ConfigSchema} from 'evm-lite-lib';

import getHandlers, {EVMLThunkAction} from '../common/Handlers';

import Actions from "../common/Actions";
import Defaults from "../../classes/Defaults";
import {keystore} from "../index";


export interface SaveConfigParams {
    config: ConfigSchema;
}

class ConfigurationActions extends Actions {

    public config: Configuration;

    constructor() {
        super();

        this.config = new Configuration(Defaults.dataDirectory, 'config.toml');

        // set handler function
        this.handlers = <S, F>(prefix: string) => getHandlers<ConfigurationActions, S, F>(this, prefix);

        // add simple action handlers
        this.addSimpleActionType('CONFIGURATION', 'READ_CONFIG');
        this.addSimpleActionType('CONFIGURATION', 'SAVE_CONFIG');
    }

    public setConfigurationDataDirectory(path: string): void {
        this.config = new Configuration(path, 'config.toml');
    }

    public handleReadConfig = (): EVMLThunkAction<ConfigSchema, string, ConfigSchema> => dispatch => {
        const {init, success, failure} = this.handlers<ConfigSchema, string>('READ_CONFIG');
        dispatch(init());
        return this.config
            .read()
            .then((config: ConfigSchema) => {
                dispatch(success(config));
                return config
            })
            .catch(() => dispatch(failure('Something went wrong reading config.')));
    };

    public handleSaveConfig = (data: SaveConfigParams): EVMLThunkAction<string, string, void> => (dispatch) => {
        const {init, success, failure} = this.handlers<string, string>('SAVE_CONFIG');
        dispatch(init());
        const oldKeystore = keystore.path;
        this.config
            .write(data.config)
            .then(() => dispatch(success('Configuration successfully saved!')))
            .then(() => dispatch(this.handleReadConfig()))
            .then(() => {
                if (data.config.defaults.keystore !== oldKeystore) {
                    keystore.setKeystorePath(data.config.defaults.keystore);
                    dispatch(keystore.handleFetchLocalAccounts());
                }
            })
            .catch(() => dispatch(failure('Something went wrong reading config.')));
    };

}

export default ConfigurationActions