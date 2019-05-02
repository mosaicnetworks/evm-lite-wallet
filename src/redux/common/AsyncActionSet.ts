import BaseReducer, { IAsyncReducer } from './reducers/AsyncReducer';

export interface BaseAction<Payload> {
	type: string;
	payload: Payload;
}

type InitHandler<I> = (payload: I) => BaseAction<I>;

type ResetHandler = () => BaseAction<undefined>;

type SuccessHandler<S> = (payload: S) => BaseAction<S>;

type FailureHandler<F> = (payload: F) => BaseAction<F>;

export interface AsyncActionState<I, S, F> {
	init: string;
	success: string;
	failure: string;
	reset: string;
	handlers: ActionStateHandlers<I, S, F>;
	reducer: (
		state: IAsyncReducer<I, S, F> | undefined,
		action: any
	) => IAsyncReducer<I, S, F>;
}

export interface ActionStateHandlers<I, S, F> {
	init: InitHandler<I>;
	success: SuccessHandler<S>;
	failure: FailureHandler<F>;
	reset: ResetHandler;
}

export default abstract class AsyncActionSet<AsyncActionStateSchema> {
	private static joinWithUpperCase(...words: string[]) {
		return words.join('_').toUpperCase();
	}

	private static lowerCaseFirstChar(word: string) {
		return word.charAt(0).toLowerCase() + word.slice(1);
	}
	public readonly actionStates: AsyncActionStateSchema = {} as AsyncActionStateSchema;

	private readonly states: string[] = ['INIT', 'SUCCESS', 'FAILURE', 'RESET'];

	protected constructor(protected readonly identifier: string) {}

	protected set actions(actions: string[]) {
		for (const action of actions) {
			const camelCasedAction = AsyncActionSet.lowerCaseFirstChar(action);

			this.actionStates[camelCasedAction] = {
				init: '',
				success: '',
				failure: '',
				reset: '',
				handlers: {} as AsyncActionStateSchema,
				reducer: null
			};

			for (const state of this.states) {
				const value = AsyncActionSet.joinWithUpperCase(
					this.identifier,
					action,
					state
				);

				this.actionStates[camelCasedAction][
					state.toLowerCase()
				] = value;

				this.actionStates[camelCasedAction].handlers[
					state.toLowerCase()
				] = <Payload>(payload: Payload) => ({
					type: value,
					payload
				});

				this.actionStates[camelCasedAction].reducer = this.AsyncReducer(
					camelCasedAction
				);
			}
		}
	}

	private AsyncReducer<I, S, F>(
		prefix: string,
		initial?: IAsyncReducer<I, S, F>
	) {
		return BaseReducer<AsyncActionSet<AsyncActionStateSchema>, I, S, F>(
			this,
			prefix,
			initial
		);
	}
}
