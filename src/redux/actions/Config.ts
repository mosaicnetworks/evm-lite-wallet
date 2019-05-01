import { ConfigSchema } from 'evm-lite-lib';

import ActionSet, { ActionState } from '../common/ActionSet';

export interface ConfigLoadPayLoad {
	path: string;
}

export interface ConfigSavePayLoad extends ConfigLoadPayLoad {
	configSchema: ConfigSchema;
}

interface ActionStateSchema {
	load: ActionState<ConfigLoadPayLoad, ConfigSchema, string>;
	save: ActionState<ConfigSavePayLoad, string, string>;
}

class Configuration extends ActionSet<ActionStateSchema> {
	constructor() {
		super(Configuration.name);

		this.actions = ['Load', 'Save'];
	}
}

export default Configuration;
