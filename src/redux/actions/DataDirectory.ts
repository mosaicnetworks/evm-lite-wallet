import AsyncActionSet, { AsyncActionState } from '../common/AsyncActionSet';

export type DataDirectorySetPayLoad = string;

interface AsyncActionStateSchema {
	setDirectory: AsyncActionState<DataDirectorySetPayLoad, string, string>;
}

export default class DataDirectory extends AsyncActionSet<
	AsyncActionStateSchema
> {
	constructor() {
		super(DataDirectory.name);

		this.actions = ['SetDirectory'];
	}
}
