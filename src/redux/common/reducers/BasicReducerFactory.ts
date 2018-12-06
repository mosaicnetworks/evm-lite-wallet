import Actions from "../Actions";

export interface BasicReducerState<T1, T2> {
    isLoading: boolean,
    response: T1 | null,
    error: T2 | null
}

const BasicReducerFactory = <A extends Actions, S, F>(instance: A, prefix: string, initial?: BasicReducerState<S, F>) => {
    const start = initial || {isLoading: false, response: null, error: null};
    prefix = prefix.toUpperCase();

    return (state = start, action: any): BasicReducerState<S, F> => {
        switch (action.type) {
            case instance.types[`${prefix}_INIT`]:
                return {
                    ...state,
                    isLoading: true,
                    response: null,
                    error: null
                };

            case instance.types[`${prefix}_SUCCESS`]:
                return {
                    ...state,
                    isLoading: false,
                    response: action.data,
                    error: null
                };
            case instance.types[`${prefix}_FAILURE`]:
                return {
                    ...state,
                    isLoading: false,
                    response: null,
                    error: action.data
                };
            case instance.types[`${prefix}_RESET`]:
                return start;
            default:
                return state;
        }
    };
};

export default BasicReducerFactory