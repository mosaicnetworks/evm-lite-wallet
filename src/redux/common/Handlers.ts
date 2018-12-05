import {ThunkAction, ThunkDispatch} from "redux-thunk";

import {Store} from "..";

import Actions from "./Actions";


export type InitHandler = () => {
    type: string;
}

export type ResetHandler = () => {
    type: string;
}

export type SuccessHandler<S> = (data: S) => {
    type: string,
    data: S
}

export type FailureHandler<F> = (data: F) => {
    type: string,
    data: F
}

export interface ActionCreatorHandlers<S, F> {
    init: InitHandler;
    success: SuccessHandler<S>;
    failure: FailureHandler<F>;
    reset: ResetHandler;
}

export interface EVMLAction<S, F> {
    type: string,
    data?: S | F
}

export type EVMLDispatch<S, F> = ThunkDispatch<Store, any, EVMLAction<S, F>>;
export type EVMLThunkAction<S, F, R = Promise<S>> = ThunkAction<R, Store, any, EVMLAction<S, F>>;
export type EVMLActionHandler<D, S, F, R> = (data?: D) => EVMLThunkAction<S, F, R>;

const getHandlers = <A extends Actions, S, F>(object: A, prefix: string): ActionCreatorHandlers<S, F> => ({
    init: () => ({type: object.types[`${prefix}_INIT`]}),
    success: (data: S) => ({type: object.types[`${prefix}_SUCCESS`], data}),
    failure: (data: F) => ({type: object.types[`${prefix}_FAILURE`], data}),
    reset: () => ({type: object.types[`${prefix}_RESET`]}),
});

export default getHandlers