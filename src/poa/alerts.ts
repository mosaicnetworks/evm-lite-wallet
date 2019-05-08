import { IAsyncReducer } from '../redux/common/reducers/AsyncReducer';

import redux from '../redux.config';

export default class ReduxSagaAlert {
	public static wrap<I, S, F>(
		reducer: IAsyncReducer<I, S, F>,
		notifHandler: (type: string, message: string) => void
	): Promise<S> {
		return new Promise<S>((resolve, reject) => {
			redux
				.promiseWrapper(reducer)

				// Redux saga 'put' success
				.then(response => {
					// notifHandler('success', 'Success!');
				})

				// Redux saga 'put' error
				.catch(error => {
					notifHandler('error', error);
				});
		});
	}

	private constructor() {}
}
