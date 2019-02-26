import Actions from '../BaseActions';

export interface IBasicReducer<I, S, F> {
	payload: I | null;
	isLoading: boolean;
	response: S | null;
	error: F | null;
}

const BasicReducerFactory = <A extends Actions<any, any>, I, S, F>(
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
	prefix = prefix.toUpperCase();

	return (state = start, action: any): IBasicReducer<I, S, F> => {
		switch (action.type) {
			case instance.types[`${prefix}_INIT`]:
				return {
					...state,
					payload: action.payload,
					isLoading: true,
					response: null,
					error: null
				};

			case instance.types[`${prefix}_SUCCESS`]:
				return {
					...state,
					isLoading: false,
					response: action.payload,
					error: null
				};
			case instance.types[`${prefix}_FAILURE`]:
				return {
					...state,
					isLoading: false,
					response: null,
					error: action.payload
				};
			case instance.types[`${prefix}_RESET`]:
				return start;
			default:
				return state;
		}
	};
};

export default BasicReducerFactory;
