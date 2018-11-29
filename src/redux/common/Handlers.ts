import {ThunkAction, ThunkDispatch} from "redux-thunk";

import {Store} from "..";

import Actions from "./Actions";


export type SuccessHandler<S> = (data: S) => {
    type: string,
    data: S
}

export type FailureHandler<F> = (data: F) => {
    type: string,
    data: F
}

export interface ActionCreatorHandlers<S, F> {
    init: () => { type: string },
    success: SuccessHandler<S>,
    failure: FailureHandler<F>
}

export interface EVMLAction<S, F> {
    type: string,
    data?: S | F
}

export type EVMLDispatch<S, F> = ThunkDispatch<Store, any, EVMLAction<S, F>>;
export type EVMLActionHandler<D, S, F, R> = (data?: D) => ThunkAction<R, Store, any, EVMLAction<S, F>>

const getHandlers = <A extends Actions, S, F>(object: A, prefix: string): ActionCreatorHandlers<S, F> => ({
    init: () => ({type: object.TYPES[`${prefix}_INIT`]}),
    success: (data: S) => ({type: object.TYPES[`${prefix}_SUCCESS`], data}),
    failure: (data: F) => ({type: object.TYPES[`${prefix}_FAILURE`], data}),
});

export default getHandlers