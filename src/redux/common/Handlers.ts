import {ThunkAction, ThunkDispatch} from "redux-thunk";

import {Store} from "..";

import Actions from "./Actions";


interface ActionCreatorHandlers {
    init: () => { type: string },
    success: <T1>(data: T1) => {
        type: string,
        data: T1,
    },
    failure: <T2>(data: T2) => {
        type: string,
        data: T2
    }
}

export interface EVMLAction<T1, T2> {
    type: string,
    data?: T1 | T2
}

export type EVMLDispatch<T1, T2> = ThunkDispatch<Store, any, EVMLAction<T1, T2>>;
export type EVMLActionHandler<T1, T2, T3> = (data?: T1) => ThunkAction<void, Store, any, EVMLAction<T2, T3>>

const getHandlers = <T1 extends Actions>(object: T1, prefix: string): ActionCreatorHandlers => ({
    init: () => ({type: object.TYPES[`${prefix}_INIT`]}),
    success: <T2>(data: T2) => ({type: object.TYPES[`${prefix}_SUCCESS`], data}),
    failure: <T3>(data: T3) => ({type: object.TYPES[`${prefix}_FAILURE`], data}),
});

export default getHandlers