import ActionSet, { ActionState } from '../common/ActionSet';

export type DataDirectorySetPayLoad = string;

interface ActionStateSchema {
	setDirectory: ActionState<string, string, string>;
}

export default class DataDirectory extends ActionSet<ActionStateSchema> {
	constructor() {
		super(DataDirectory.name);

		this.actions = ['SetDirectory'];
	}
}
