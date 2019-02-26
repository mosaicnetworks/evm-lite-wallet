import { ConfigSchema } from 'evm-lite-lib';

import BaseActions, {
	ActionCreatorHandlers,
	ActionInterface,
	ActionValue
} from '../common/BaseActions';

export interface ConfigLoadPayLoad {
	directory: string;
	name: string;
}

export interface ConfigSavePayLoad extends ConfigLoadPayLoad {
	configSchema: ConfigSchema;
}

interface HandlerSchema {
	load: ActionCreatorHandlers<ConfigLoadPayLoad, ConfigSchema, string>;
	save: ActionCreatorHandlers<ConfigSavePayLoad, string, string>;
}

interface ActionSchema extends ActionInterface {
	load: ActionValue;
	save: ActionValue;
}

class Configuration extends BaseActions<HandlerSchema, ActionSchema> {
	public handlers: HandlerSchema;

	constructor() {
		super(Configuration.name);

		this.prefixes = ['Load', 'Save'];

		this.handlers = {
			load: this.generateHandlers<
				ConfigLoadPayLoad,
				ConfigSchema,
				string
			>('Load'),
			save: this.generateHandlers<ConfigSavePayLoad, string, string>(
				'Save'
			)
		};
	}
}

export default Configuration;
