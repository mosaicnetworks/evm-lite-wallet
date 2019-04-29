import BaseActions, {
	ActionCreatorHandlers,
	ActionInterface,
	ActionValue
} from '../common/BaseActions';

export type DataDirectorySetPayLoad = string;

interface HandlerSchema {
	setDirectory: ActionCreatorHandlers<string, string, string>;
}

interface ActionSchema extends ActionInterface {
	setDirectory: ActionValue;
}

export default class DataDirectory extends BaseActions<
	HandlerSchema,
	ActionSchema
> {
	public handlers: HandlerSchema;

	constructor() {
		super(DataDirectory.name);

		this.prefixes = ['SetDirectory'];

		this.handlers = {
			setDirectory: this.generateHandlers<string, string, string>(
				'SetDirectory'
			)
		};
	}
}
