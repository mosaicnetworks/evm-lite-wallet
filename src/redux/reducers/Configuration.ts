import {InitialReducerState} from "../common/Reducer";

import ConfigurationActions from "../actions/Configuration";
import {combineReducers} from "redux";


export interface ConfigReducer {
    readConfig: ReadConfigReducerState,
    saveConfig: SaveConfigReducerState
}

interface ReadConfigReducerState extends InitialReducerState {
    readConfigResponse: any,
    readConfigError: string,
}

interface SaveConfigReducerState extends InitialReducerState {
    saveConfigResponse: string,
    saveConfigError: string,
}

const readConfigInitialState: ReadConfigReducerState = {
    isLoading: false,
    readConfigResponse: null,
    readConfigError: '',
};

const saveConfigInitialState: SaveConfigReducerState = {
    isLoading: false,
    saveConfigResponse: '',
    saveConfigError: ''
};

const ReadConfigReducer = (state = readConfigInitialState, action: any) => {
    switch (action.type) {
        case ConfigurationActions.TYPES.READ_CONFIG_INIT:
            return {
                ...state,
                isLoading: true,
                readConfigResponse: null,
                readConfigError: ''
            };
        case ConfigurationActions.TYPES.READ_CONFIG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                readConfigResponse: action.data,
                readConfigError: ''
            };
        case ConfigurationActions.TYPES.READ_CONFIG_FAILURE:
            return {
                ...state,
                isLoading: false,
                readConfigResponse: null,
                readConfigError: action.data
            };
        default:
            return state;
    }
};

const SaveConfigReducer = (state = saveConfigInitialState, action: any) => {
    switch (action.type) {
        case ConfigurationActions.TYPES.SAVE_CONFIG_INIT:
            return {
                ...state,
                isLoading: true,
                saveConfigResponse: '',
                saveConfigError: ''
            };
        case ConfigurationActions.TYPES.SAVE_CONFIG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                saveConfigResponse: action.data,
                saveConfigError: ''
            };
        case ConfigurationActions.TYPES.SAVE_CONFIG_FAILURE:
            return {
                ...state,
                isLoading: false,
                saveConfigResponse: '',
                saveConfigError: action.data
            };
        default:
            return state;
    }
};

const ConfigReducer = combineReducers({
    readConfig: ReadConfigReducer,
    saveConfig: SaveConfigReducer,
});

export default ConfigReducer;