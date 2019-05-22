import { combineReducers } from 'redux';

import { IAsyncReducer } from '../common/reducers/AsyncReducer';

import POA, {
	POANominatePayLoad,
	POAVotePayLoad,
	WhiteListEntry
} from '../actions/POA';

export type POANominateReducer = IAsyncReducer<
	POANominatePayLoad,
	string,
	string
>;
export type POAVoteReducer = IAsyncReducer<POAVotePayLoad, string, string>;
export type POAWhiteListReducer = IAsyncReducer<
	undefined,
	WhiteListEntry[],
	string
>;

export interface IPOAReducer {
	nominate: POANominateReducer;
	vote: POAVotePayLoad;
	whiteList: POAWhiteListReducer;
}

const poa = new POA();

const POAReducer = combineReducers({
	nominate: poa.actionStates.nominate.reducer,
	vote: poa.actionStates.vote.reducer,
	whiteList: poa.actionStates.whiteList.reducer
});

export default POAReducer;
