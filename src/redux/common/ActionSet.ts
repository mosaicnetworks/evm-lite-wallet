import BaseReducer, { IBasicReducer } from './reducers/BaseReducer';

export interface BaseAction<Payload> {
	type: string;
	payload: Payload;
}

type InitHandler<I> = (payload: I) => BaseAction<I>;

type ResetHandler = () => BaseAction<undefined>;

type SuccessHandler<S> = (payload: S) => BaseAction<S>;

type FailureHandler<F> = (payload: F) => BaseAction<F>;

export interface ActionState<I, S, F> {
	init: string;
	success: string;
	failure: string;
	reset: string;
	handlers: ActionStateHandlers<I, S, F>;
	reducer: (
		state: IBasicReducer<I, S, F> | undefined,
		action: any
	) => IBasicReducer<I, S, F>;
}

export interface ActionStateHandlers<I, S, F> {
	init: InitHandler<I>;
	success: SuccessHandler<S>;
	failure: FailureHandler<F>;
	reset: ResetHandler;
}

export default abstract class ActionSet<ActionStateSchema> {
	private static joinWithUpperCase(...words: string[]) {
		return words.join('_').toUpperCase();
	}

	private static lowerCaseFirstChar(word: string) {
		return word.charAt(0).toLowerCase() + word.slice(1);
	}
	public readonly actionStates: ActionStateSchema = {} as ActionStateSchema;

	private readonly states: string[] = ['INIT', 'SUCCESS', 'FAILURE', 'RESET'];

	public constructor(protected readonly identifier: string) {}

	protected set actions(actions: string[]) {
		for (const action of actions) {
			const camelCasedAction = ActionSet.lowerCaseFirstChar(action);

			this.actionStates[camelCasedAction] = {
				init: '',
				success: '',
				failure: '',
				reset: '',
				handlers: {} as ActionStateSchema,
				reducer: null
			};

			for (const state of this.states) {
				const value = ActionSet.joinWithUpperCase(
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

				this.actionStates[
					camelCasedAction
				].reducer = this.SimpleReducer(camelCasedAction);
			}
		}
	}

	public SimpleReducer<I, S, F>(
		prefix: string,
		initial?: IBasicReducer<I, S, F>
	) {
		return BaseReducer<ActionSet<ActionStateSchema>, I, S, F>(
			this,
			prefix,
			initial
		);
	}
}
