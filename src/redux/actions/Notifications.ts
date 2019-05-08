import ActionSet, { ArrayActionState } from '../common/ActionSet';

export type DataDirectorySetPayLoad = string;

export interface NotificationPayLoad {
	type: 'error' | 'success' | 'info' | 'warning';
	topic: string;
	message: string;
}

interface ActionStateSchema {
	notification: ArrayActionState<NotificationPayLoad>;
}

export default class Notifications extends ActionSet<ActionStateSchema> {
	constructor() {
		super(Notifications.name);

		this.states = [];
		this.arrayStates = ['Notification'];
	}
}

const notif = new Notifications();

console.log(notif.allStates);
