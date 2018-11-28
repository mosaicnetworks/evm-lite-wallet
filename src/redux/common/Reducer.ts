import Actions from "./Actions";


export interface ReducerState<T1, T2> {
    isLoading: boolean,
    response: T1,
    error: T2
}

const BasicReducerFactory = <T1 extends Actions, T2, T3>(object: T1, prefix: string, initial: ReducerState<T2, T3>) => {
    return (state = initial, action: any): ReducerState<T2, T3> => {
        switch (action.type) {
            case object.TYPES[`${prefix}_INIT`]:
                return {
                    ...state,
                    isLoading: true,
                };
            case object.TYPES[`${prefix}_SUCCESS`]:
                return {
                    ...state,
                    isLoading: false,
                    response: action.data,
                };
            case object.TYPES[`${prefix}_FAILURE`]:
                return {
                    ...state,
                    isLoading: false,
                    error: action.data
                };
            default:
                return state;
        }
    };
};

export default BasicReducerFactory