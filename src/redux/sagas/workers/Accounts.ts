import Accounts, { AccountsDecryptPayload } from '../../actions/Accounts';

interface AccountsDecryptAction {
	type: string;
	payload: AccountsDecryptPayload;
}

const accounts = new Accounts();

console.log(accounts);

export function* accountsDecryptWorker(action: AccountsDecryptAction) {
	try {
		// pass
	} catch (e) {
		// pass
	}
}
