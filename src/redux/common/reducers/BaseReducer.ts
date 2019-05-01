import ActionSet from '../ActionSet';

export interface IBasicReducer<I, S, F> {
	payload: I | null;
	isLoading: boolean;
	response: S | null;
	error: F | null;
}

const BasicReducerFactory = <A extends ActionSet<any>, I, S, F>(
	instance: A,
	prefix: string,
	initial?: IBasicReducer<I, S, F>
) => {
	const start = initial || {
		payload: null,
		isLoading: false,
		response: null,
		error: null
	};

	return (state = start, action: any): IBasicReducer<I, S, F> => {
		switch (action.type) {
			case instance.actionStates[prefix].init:
				return {
					...state,
					payload: action.payload,
					isLoading: true,
					response: null,
					error: null
				};

			case instance.actionStates[prefix].success:
				return {
					...state,
					isLoading: false,
					response: action.payload,
					error: null
				};
			case instance.actionStates[prefix].failure:
				return {
					...state,
					isLoading: false,
					response: null,
					error: action.payload
				};
			case instance.actionStates[prefix].reset:
				return start;
			default:
				return state;
		}
	};
};

export default BasicReducerFactory;
