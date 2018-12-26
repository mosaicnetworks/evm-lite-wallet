import { BaseAccount } from 'evm-lite-lib';

import BaseActions, { ActionCreatorHandlers, ActionInterface, ActionValue } from '../common/BaseActions';


export interface KeystoreListPayload {
	directory: string;
	name: string;
}

export interface KeystoreUpdatePayload {
	address: string;
	old: string;
	new: string;
}

interface HandlerSchema {
	list: ActionCreatorHandlers<KeystoreListPayload, BaseAccount[], string>;
	update: ActionCreatorHandlers<KeystoreUpdatePayload, BaseAccount, string>;
}

interface ActionSchema extends ActionInterface {
	list: ActionValue;
	update: ActionValue;
}

export default class KeystoreActions extends BaseActions<HandlerSchema, ActionSchema> {

	public handlers: HandlerSchema;

	constructor() {
		super(KeystoreActions.name);
		this.prefixes = [
			'List',
			'Create',
			'Update',
			'Export',
			'Import'
		];

		this.handlers = {
			list: this.generateHandlers<KeystoreListPayload, BaseAccount[], string>('List'),
			update: this.generateHandlers<KeystoreUpdatePayload, BaseAccount, string>('Update')
		};
	}

}
