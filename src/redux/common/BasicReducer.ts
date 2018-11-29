import Actions from "./Actions";


export interface BasicReducerState<T1, T2> {
    isLoading: boolean,
    response: T1 | null,
    error: T2 | null
}

const BasicReducerFactory = <T1 extends Actions, T2, T3>(object: T1, prefix: string, initial?: BasicReducerState<T2, T3>) => {
    const start = initial || {isLoading: false, response: null, error: null};

    return (state = start, action: any): BasicReducerState<T2, T3> => {
        switch (action.type) {
            case object.TYPES[`${prefix}_INIT`]:
                return {
                    ...state,
                    isLoading: true,
                    response: null,
                    error: null
                };
            case object.TYPES[`${prefix}_SUCCESS`]:
                return {
                    ...state,
                    isLoading: false,
                    response: action.data,
                    error: null
                };
            case object.TYPES[`${prefix}_FAILURE`]:
                return {
                    ...state,
                    isLoading: false,
                    response: null,
                    error: action.data
                };
            default:
                return state;
        }
    };
};

export default BasicReducerFactory