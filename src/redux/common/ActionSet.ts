export interface State {
	app: {
		setDirectory: {
			response: '';
			error: '';
		};
	};
}

export default abstract class ActionSet<ActionSetSchema> {
	constructor() {
		// pass
	}
}
