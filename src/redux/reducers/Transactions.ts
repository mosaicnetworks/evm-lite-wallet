import {combineReducers} from "redux";
import {IBasicReducer} from "../common/reducers/BasicReducerFactory";

import Transactions from "../actions/Transactions";


export interface ITransactionsReducer {
    histories: IBasicReducer<any, string>;
}

const transactions = new Transactions();

const TransactionsReducer = combineReducers({
    histories: transactions.SimpleReducer<any, string>('History')
});

export default TransactionsReducer;