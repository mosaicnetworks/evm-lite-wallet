import {
	ContractExecuteConstantMethodPayload,
	ContractExecuteMethodPayload
} from '../../actions/Contract';

interface ContractExecuteMethodAction {
	type: string;
	payload: ContractExecuteMethodPayload;
}

interface ContractExecuteConstantMethodAction {
	type: string;
	payload: ContractExecuteConstantMethodPayload;
}

// const contract = new Contract();

export function* contractExecuteMethodWorker(
	action: ContractExecuteMethodAction
) {
	try {
		// pass
	} catch (e) {
		// pass
	}
}

export function* contractExecuteConstantMethodWorker(
	action: ContractExecuteConstantMethodAction
) {
	try {
		// pass
	} catch (e) {
		// pass
	}
}
