import {combineReducers} from "redux";

import {BaseAccount} from "evml-cli";

import AccountsActions from "../actions/Accounts";


export interface AccountsReducer {
    fetchEvents: FetchEventsReducer;
    updateAccount: AccountUpdateReducer;
    createAccount: AccountCreateReducer;
}

interface InitialState {
    isLoading: boolean,
}

interface FetchEventsReducer extends InitialState {
    fetchLocalResponse: BaseAccount[],
    fetchLocalError: string,
}

interface AccountUpdateReducer extends InitialState {
    updateAccountResponse: string;
    updateAccountError: string;
}

interface AccountCreateReducer extends InitialState {
    createAccountResponse: string;
    createAccountError: string;
}

const fetchEventsInitialState: FetchEventsReducer = {
    isLoading: false,
    fetchLocalResponse: [],
    fetchLocalError: '',
};

const createAccountInitialState: AccountCreateReducer = {
    isLoading: false,
    createAccountResponse: '',
    createAccountError: '',
};

const accountUpdateInitialState: AccountUpdateReducer = {
    isLoading: false,
    updateAccountResponse: '',
    updateAccountError: ''
};

const FetchEventsReducer = (state = fetchEventsInitialState, action: any) => {
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

const CreateAccountReducer = (state = createAccountInitialState, action: any) => {
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

const UpdateAccountReducer = (state = accountUpdateInitialState, action: any) => {
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
});

export default AccountsReducer;
