import ConfigurationActions from "../actions/Configuration";

export interface ConfigReducerInitialState {
    isLoading: boolean,
    readConfigResponse: any,
    readConfigError: string,
    saveConfigResponse: string,
    saveConfigError: string,
}

const configInitialState: ConfigReducerInitialState = {
    isLoading: false,
    readConfigResponse: null,
    readConfigError: '',
    saveConfigResponse: '',
    saveConfigError: ''
};

const ConfigReducer = (state = configInitialState, action: any) => {
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

export default ConfigReducer;