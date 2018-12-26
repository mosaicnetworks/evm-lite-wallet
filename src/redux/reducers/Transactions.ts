import { combineReducers } from 'redux';
import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Transactions, { AccountTransactionHistory, TransactionHistoryPayload } from '../actions/Transactions';


export type TransactionHistoryType = IBasicReducer<TransactionHistoryPayload, AccountTransactionHistory, string>

export interface ITransactionsReducer {
	history: TransactionHistoryType;
}

const transactions = new Transactions();

const TransactionsReducer = combineReducers({
	history:
		transactions.SimpleReducer<TransactionHistoryPayload, AccountTransactionHistory, string>('History')
});

export default TransactionsReducer;
