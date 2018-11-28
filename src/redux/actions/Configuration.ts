import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";

import {Config} from 'evm-lite-lib';

import {Store} from "..";

import Actions from "../common/Actions";
import getHandlers from '../common/Handlers';


class ConfigurationActions extends Actions {

    public static TYPES = {
        READ_CONFIG_INIT: 'READ_CONFIG_INIT',
        READ_CONFIG_SUCCESS: 'READ_CONFIG_SUCCESS',
        READ_CONFIG_FAILURE: 'READ_CONFIG_FAILURE',

        SAVE_CONFIG_INIT: 'SAVE_CONFIG_INIT',
        SAVE_CONFIG_SUCCESS: 'SAVE_CONFIG_SUCCESS',
        SAVE_CONFIG_FAILURE: 'SAVE_CONFIG_FAILURE',
    };

    public static handleReadConfig = (): ThunkAction<void, Store, any, AnyAction> => {
        const {init, success, failure} = ConfigurationActions.handlers('READ_CONFIG');

        return (dispatch) => {
            dispatch(init());
            return ConfigurationActions.config
                .read()
                .then((config: any) => {
                    dispatch(success<any>(config));
                })
                .catch(() => dispatch(failure<string>('Something went wrong reading config.')));
        }
    };

    public static handleSaveConfig = (configState: any): ThunkAction<void, Store, any, AnyAction> => {
        const {init, success, failure} = ConfigurationActions.handlers('SAVE_CONFIG');

        return (dispatch) => {
            dispatch(init());
            const data = {defaults: configState};
            return ConfigurationActions.config
                .write(data)
                .then(() => {
                    setTimeout(() => dispatch(success<string>('Configuration successfully saved!')), 2000);
                })
                .catch(() => dispatch(failure<string>('Something went wrong reading config.')));
        }
    };

    private static config = new Config('/Users/danu/.evmlc', 'config.toml');
    private static handlers = (prefix: string) => getHandlers<ConfigurationActions>(ConfigurationActions, prefix)

}

export default ConfigurationActions