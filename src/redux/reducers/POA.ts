import { combineReducers } from 'redux';

import { IBasicReducer } from '../common/reducers/BaseReducer';

import POA, { POANominatePayLoad, POAVotePayLoad } from '../actions/POA';

export type POANominateReducer = IBasicReducer<
	POANominatePayLoad,
	string,
	string
>;
export type POAVoteReducer = IBasicReducer<POAVotePayLoad, string, string>;

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
