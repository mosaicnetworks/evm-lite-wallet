import {combineReducers} from "redux";

import {BaseAccount} from "evm-lite-lib";

import {InitialReducerState} from "../common/Reducer";

import AccountsActions from "../actions/Accounts";


export interface AccountsReducer {
    fetchEvents: FetchEventsReducer;
    updateAccount: AccountUpdateReducer;
    createAccount: AccountCreateReducer;
    exportAccount: AccountExportReducer;
    importAccount: AccountImportReducer;
    transferAccount: AccountTransferReducer;
}

interface FetchEventsReducer extends InitialReducerState {
    fetchLocalResponse: BaseAccount[],
    fetchLocalError: string,
}

interface AccountUpdateReducer extends InitialReducerState {
    updateAccountResponse: string;
    updateAccountError: string;
}

interface AccountCreateReducer extends InitialReducerState {
    createAccountResponse: string;
    createAccountError: string;
}

interface AccountImportReducer extends InitialReducerState {
    importAccountResponse: string;
    importAccountError: string;
}

interface AccountExportReducer extends InitialReducerState {
    exportAccountResponse: string;
    exportAccountError: string;
}

interface AccountTransferReducer extends InitialReducerState {
    transferAccountResponse: string;
    transferAccountError: string;
}

const eventsFetchInitialState: FetchEventsReducer = {
    isLoading: false,
    fetchLocalResponse: [],
    fetchLocalError: '',
};

const accountCreateInitialState: AccountCreateReducer = {
    isLoading: false,
    createAccountResponse: '',
    createAccountError: '',
};

const accountUpdateInitialState: AccountUpdateReducer = {
    isLoading: false,
    updateAccountResponse: '',
    updateAccountError: ''
};

const accountImportInitialState: AccountImportReducer = {
    isLoading: false,
    importAccountResponse: '',
    importAccountError: ''
};

const accountExportInitialState: AccountExportReducer = {
    isLoading: false,
    exportAccountResponse: '',
    exportAccountError: ''
};

const accountTransferInitialState: AccountTransferReducer = {
    isLoading: false,
    transferAccountResponse: '',
    transferAccountError: ''
};

const TransferAccountReducer = (state = accountTransferInitialState, action: any): AccountTransferReducer => {
    switch (action.type) {
        case AccountsActions.TYPES.TRANSFER_INIT:
            return {
                ...state,
                isLoading: true,
                transferAccountResponse: '',
                transferAccountError: '',
            };
        case AccountsActions.TYPES.TRANSFER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                transferAccountResponse: action.data,
                transferAccountError: ''
            };
        case AccountsActions.TYPES.TRANSFER_FAILURE:
            return {
                ...state,
                isLoading: false,
                transferAccountResponse: '',
                transferAccountError: action.data
            };
        default:
            return state;
    }
};

const ImportAccountReducer = (state = accountImportInitialState, action: any): AccountImportReducer => {
    switch (action.type) {
        case AccountsActions.TYPES.IMPORT_INIT:
            return {
                ...state,
                isLoading: true,
                importAccountResponse: '',
                importAccountError: '',
            };
        case AccountsActions.TYPES.IMPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                importAccountResponse: action.data,
                importAccountError: ''
            };
        case AccountsActions.TYPES.IMPORT_FAILURE:
            return {
                ...state,
                isLoading: false,
                importAccountResponse: '',
                importAccountError: action.data
            };
        default:
            return state;
    }
};

const ExportAccountReducer = (state = accountExportInitialState, action: any): AccountExportReducer => {
    switch (action.type) {
        case AccountsActions.TYPES.EXPORT_INIT:
            return {
                ...state,
                isLoading: true,
                exportAccountResponse: '',
                exportAccountError: '',
            };
        case AccountsActions.TYPES.EXPORT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                exportAccountResponse: action.data,
                exportAccountError: ''
            };
        case AccountsActions.TYPES.EXPORT_FAILURE:
            return {
                ...state,
                isLoading: false,
                exportAccountResponse: '',
                exportAccountError: action.data
            };
        default:
            return state;
    }
};

const FetchEventsReducer = (state = eventsFetchInitialState, action: any): FetchEventsReducer => {
    switch (action.type) {
        case AccountsActions.TYPES.FETCH_LOCAL_INIT:
            return {
                ...state,
                isLoading: true,
                fetchLocalResponse: [],
                fetchLocalError: '',
            };
        case AccountsActions.TYPES.FETCH_LOCAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                fetchLocalResponse: action.data,
                fetchLocalError: ''
            };
        case AccountsActions.TYPES.FETCH_LOCAL_FAILURE:
            return {
                ...state,
                isLoading: false,
                fetchLocalResponse: [],
                fetchLocalError: action.data
            };
        default:
            return state;
    }
};

const CreateAccountReducer = (state = accountCreateInitialState, action: any): AccountCreateReducer => {
    switch (action.type) {
        case AccountsActions.TYPES.CREATE_INIT:
            return {
                ...state,
                isLoading: true,
                createAccountResponse: '',
                createAccountError: '',
            };
        case AccountsActions.TYPES.CREATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                createAccountResponse: action.data,
                createAccountError: '',
            };
        case AccountsActions.TYPES.FETCH_LOCAL_FAILURE:
            return {
                ...state,
                isLoading: false,
                createAccountResponse: '',
                createAccountError: action.data,
            };
        default:
            return state;
    }
};

const UpdateAccountReducer = (state = accountUpdateInitialState, action: any): AccountUpdateReducer => {
    switch (action.type) {
        case AccountsActions.TYPES.UPDATE_PASSWORD_INIT:
            return {
                ...state,
                isLoading: true,
                updateAccountResponse: '',
                updateAccountError: ''
            };
        case AccountsActions.TYPES.UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                updateAccountResponse: action.data,
                updateAccountError: ''
            };
        case AccountsActions.TYPES.UPDATE_PASSWORD_FAILURE:
            return {
                ...state,
                isLoading: false,
                updateAccountResponse: '',
                updateAccountError: action.data
            };

        default:
            return state;
    }
};

const AccountsReducer = combineReducers({
    fetchEvents: FetchEventsReducer,
    updateAccount: UpdateAccountReducer,
    createAccount: CreateAccountReducer,
    importAccount: ImportAccountReducer,
    exportAccount: ExportAccountReducer,
    transferAccount: TransferAccountReducer,
});

export default AccountsReducer;
