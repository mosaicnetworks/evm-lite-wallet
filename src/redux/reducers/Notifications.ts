import { ISyncArrayReducer } from '../common/reducers/SyncArrayReducer';

import Notifications, { NotificationPayLoad } from '../actions/Notifications';

export type INotificationsReducer = ISyncArrayReducer<NotificationPayLoad>;

const notifications = new Notifications();
const NotificationsReducer = notifications.allStates.notification.reducer;

export default NotificationsReducer;
