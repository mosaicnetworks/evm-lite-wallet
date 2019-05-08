import ActionSet from '../ActionSet';

export type ISyncArrayReducer<P> = P[];

const SyncArrayReducer = <A extends ActionSet<any>, P>(
	instance: A,
	prefix: string,
	initial?: ISyncArrayReducer<P>
) => {
	const start = initial || [];

	return (state = start, action: any): ISyncArrayReducer<P> => {
		switch (action.type) {
			case instance.allStates[prefix].set:
				return action.payload;
			case instance.allStates[prefix].append:
				return [...state, action.payload];
			default:
				return state;
		}
	};
};

export default SyncArrayReducer;
