interface Account {
	moniker: string;
}

export interface Validator extends Account {
	address: string;
}

interface Nominee extends Account {
	address: string;

	// Are only validators allowed to nominate?
	nominator: Validator;
}

interface Vote {
	validator: Validator;
	nominee: Nominee;
	verdict: boolean;
}

export interface NomineeElection extends Nominee {
	votes: Vote[];
}

interface POAState {
	validators: Validator[];
	elections: NomineeElection[];
}

// Implementation
const POAState: POAState = {
	validators: [
		{
			moniker: 'Giacomo',
			address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
		},
		{
			moniker: 'Kevin',
			address: '0xC40352A3840f05233DF3cEd4740897973e321404'
		},
		{
			moniker: 'Jon',
			address: '0x1EE60b5e39Cd9652Fe0eDb11ceC62CaF5FaBD6C9'
		}
	],
	elections: [
		{
			moniker: 'Danu',
			address: '0x873375ac5181D80404A330c97f08704273b3b865',
			nominator: {
				moniker: 'Giacomo',
				address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
			},
			votes: [] as Vote[]
		}
	]
};

export default POAState;
