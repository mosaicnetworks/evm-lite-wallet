import { ConfigSchema } from 'evm-lite-lib';

import AsyncActionSet, { AsyncActionState } from '../common/AsyncActionSet';

export interface ConfigLoadPayLoad {
	path: string;
}

export interface ConfigSavePayLoad extends ConfigLoadPayLoad {
	configSchema: ConfigSchema;
}

interface AsyncActionStateSchema {
	load: AsyncActionState<ConfigLoadPayLoad, ConfigSchema, string>;
	save: AsyncActionState<ConfigSavePayLoad, string, string>;
}

class Configuration extends AsyncActionSet<AsyncActionStateSchema> {
	constructor() {
		super(Configuration.name);

		this.actions = ['Load', 'Save'];
	}
}

export default Configuration;
