import store, {Store} from './store/Store';
import Accounts from './actions/Accounts';
import Keystore from './actions/Keystore';
import Configuration from './actions/Configuration';
import Application from './actions/App';

import {ThunkAction, ThunkDispatch} from "redux-thunk";


export interface EVMLAction<S, F> {
    type: string,
    data?: S | F
}

export type EVMLDispatch<S, F> = ThunkDispatch<Store, any, EVMLAction<S, F>>;
export type EVMLThunkAction<S, F, R = Promise<S>> = ThunkAction<R, Store, any, EVMLAction<S, F>>;
export type EVMLActionHandler<D, S, F, R> = (data?: D) => EVMLThunkAction<S, F, R>;

export const accounts = new Accounts();
export const configuration = new Configuration();
export const app = new Application();
export const keystore = new Keystore();

export {DataDirectoryParams} from './actions/App'
export {DefaultProps, Store} from './store/Store'

export {BaseAccount, ConfigSchema} from 'evm-lite-lib'

export default store;