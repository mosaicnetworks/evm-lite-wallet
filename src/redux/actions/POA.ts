import AsyncActionSet, { AsyncActionState } from '../common/AsyncActionSet';

export interface POANominatePayLoad {
	nominee: string;
	nominator: string;
}

export interface POAVotePayLoad {
	nominee: string;
	verdict: boolean;
}

interface AsyncActionStateSchema {
	nominate: AsyncActionState<POANominatePayLoad, string, string>;
	vote: AsyncActionState<POAVotePayLoad, string, string>;
}

export default class POA extends AsyncActionSet<AsyncActionStateSchema> {
	constructor() {
		super(POA.name);

		this.actions = ['Nominate', 'Vote'];
	}
}
