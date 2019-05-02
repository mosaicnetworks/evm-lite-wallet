import ActionSet, { ActionState } from '../common/ActionSet';

export interface POANominatePayLoad {
	nominee: string;
	nominator: string;
}

export interface POAVotePayLoad {
	nominee: string;
	verdict: boolean;
}

interface ActionStateSchema {
	nominate: ActionState<POANominatePayLoad, string, string>;
	vote: ActionState<POAVotePayLoad, string, string>;
}

export default class POA extends ActionSet<ActionStateSchema> {
	constructor() {
		super(POA.name);

		this.actions = ['Nominate', 'Vote'];
	}
}
