import { IAsyncReducer } from '../redux/common/reducers/AsyncReducer';

import redux from '../redux.config';

const defaultNotifHandler = (
	self: React.Component,
	type: 'error' | 'success',
	message: string
) => {
	// @ts-ignore
	self.props.alert[type](message);
};

export const notificationHandler = (self: React.Component) =>
	defaultNotifHandler.bind(null, self);

export default class ReduxSagaAlert {
	public static wrap<I, S, F>(
		reducer: IAsyncReducer<I, S, F>,
		successMessage: string,
		errorMessage: string,
		notifHandler: (type: 'success' | 'error', message: string) => void
	): Promise<S> {
		return new Promise<S>((resolve, reject) => {
			redux
				.promiseWrapper(reducer)

				// Redux saga 'put' success
				.then(response => {
					console.log('RESPONE: ', response);
					notifHandler('success', successMessage);
				})

				// Redux saga 'put' error
				.catch(error => {
					notifHandler('error', error);
				});
		});
	}

	private constructor() {}
}
