import { combineReducers } from 'redux';

import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import POA, { POANominatePayLoad, POAVotePayLoad } from '../actions/POA';

export type POANominateReducer = IAsyncReducer<
	POANominatePayLoad,
	string,
	string
>;
export type POAVoteReducer = IAsyncReducer<POAVotePayLoad, string, string>;

export interface IPOAReducer {
	nominate: POANominateReducer;
	vote: POAVotePayLoad;
}

const poa = new POA();

const POAReducer = combineReducers({
	nominate: poa.actionStates.nominate.reducer,
	vote: poa.actionStates.vote.reducer
});

export default POAReducer;
