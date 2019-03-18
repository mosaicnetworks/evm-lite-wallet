import { BaseAccount } from 'evm-lite-lib';

import BaseActions, {
	ActionCreatorHandlers,
	ActionInterface,
	ActionValue
} from '../common/BaseActions';

export interface KeystoreListPayLoad {
	path: string;
}

export interface KeystoreUpdatePayLoad {
	address: string;
	old: string;
	new: string;
}

export interface KeystoreCreatePayLoad {
	password: string;
	keystore: string;
}

interface HandlerSchema {
	list: ActionCreatorHandlers<KeystoreListPayLoad, BaseAccount[], string>;
	update: ActionCreatorHandlers<KeystoreUpdatePayLoad, BaseAccount, string>;
	create: ActionCreatorHandlers<KeystoreCreatePayLoad, BaseAccount, string>;
}

interface ActionSchema extends ActionInterface {
	list: ActionValue;
	update: ActionValue;
	create: ActionValue;
}

export default class KeystoreActions extends BaseActions<
	HandlerSchema,
	ActionSchema
> {
	public handlers: HandlerSchema;

	constructor() {
		super(KeystoreActions.name);
		this.prefixes = ['List', 'Create', 'Update', 'Export', 'Import'];

		this.handlers = {
			list: this.generateHandlers<
				KeystoreListPayLoad,
				BaseAccount[],
				string
			>('List'),
			update: this.generateHandlers<
				KeystoreUpdatePayLoad,
				BaseAccount,
				string
			>('Update'),
			create: this.generateHandlers<
				KeystoreCreatePayLoad,
				BaseAccount,
				string
			>('Create')
		};
	}
}
