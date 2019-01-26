import BasicReducerFactory, {
	IBasicReducer
} from './reducers/BasicReducerFactory';

interface ActionTypes {
	[key: string]: string;
}

export interface ActionInterface {
	[key: string]: {
		init: string;
		success: string;
		failure: string;
		reset: string;
	};
}

export interface ActionValue {
	init: string;
	success: string;
	failure: string;
	reset: string;
}

type ActionPrefixes = string[];

type InitHandler<I> = (
	payload: I
) => {
	type: string;
	payload: I;
};

type ResetHandler = () => {
	type: string;
};

type SuccessHandler<S> = (
	payload: S
) => {
	type: string;
	payload: S;
};

type FailureHandler<F> = (
	payload: F
) => {
	type: string;
	payload: F;
};

export interface ActionCreatorHandlers<I, S, F> {
	init: InitHandler<I>;
	success: SuccessHandler<S>;
	failure: FailureHandler<F>;
	reset: ResetHandler;
}

type ActionSuffixes = Readonly<'INIT' | 'SUCCESS' | 'FAILURE' | 'RESET'>;

export default abstract class BaseActions<Handlers, Actions> {
	public abstract handlers: Handlers;

	private readonly delimiter = '_';
	private readonly suffixes: ActionSuffixes[] = [
		'INIT',
		'SUCCESS',
		'FAILURE',
		'RESET'
	];
	private readonly prefixCollection: ActionPrefixes;
	private readonly actionTypes: ActionTypes;

	private readonly handlerGeneratorFunctions: {
		[key: string]: <I, S, F>() => Readonly<ActionCreatorHandlers<I, S, F>>;
	};

	private readonly actionsObject: ActionInterface | Actions;

	protected constructor(private identifier: string) {
		this.actionTypes = {};
		this.handlerGeneratorFunctions = {};
		this.prefixCollection = [];
		this.actionsObject = {};
	}

	public get actions(): Actions | ActionInterface {
		return this.actionsObject;
	}

	public get types(): ActionTypes {
		return this.actionTypes;
	}

	protected get prefixes(): Readonly<ActionPrefixes> {
		return this.prefixCollection;
	}

	protected set prefixes(value: ActionPrefixes) {
		const { actionTypes, identifier } = this;

		for (const prefix of value) {
			for (const suffix of this.suffixes) {
				const key = this.joinWithUpperCase(prefix, suffix);
				const val = this.joinWithUpperCase(identifier, key);

				actionTypes[`${key}`] = `${val}`;
			}

			this.handlerGeneratorFunctions[prefix.toUpperCase()] = <
				I,
				S,
				F
			>() => ({
				init: payload => ({
					type: this.types[
						this.joinWithUpperCase(prefix, this.suffixes[0])
					],
					payload
				}),
				success: payload => ({
					type: this.types[
						this.joinWithUpperCase(prefix, this.suffixes[1])
					],
					payload
				}),
				failure: payload => ({
					type: this.types[
						this.joinWithUpperCase(prefix, this.suffixes[2])
					],
					payload
				}),
				reset: () => ({
					type: this.types[
						this.joinWithUpperCase(prefix, this.suffixes[3])
					]
				})
			});

			this.actionsObject[prefix.toLowerCase()] = {
				init: this.joinWithUpperCase(identifier, prefix, 'Init'),
				success: this.joinWithUpperCase(identifier, prefix, 'Success'),
				failure: this.joinWithUpperCase(identifier, prefix, 'Failure'),
				reset: this.joinWithUpperCase(identifier, prefix, 'Reset')
			};

			this.prefixCollection.push(prefix.toUpperCase());
		}
	}

	public SimpleReducer<I, S, F>(
		prefix: string,
		initial?: IBasicReducer<I, S, F>
	) {
		return BasicReducerFactory<BaseActions<Handlers, Actions>, I, S, F>(
			this,
			prefix,
			initial
		);
	}

	protected generateHandlers<I, S, F>(
		prefix: string
	): Readonly<ActionCreatorHandlers<I, S, F>> {
		return this.handlerGeneratorFunctions[prefix.toUpperCase()]<I, S, F>();
	}

	protected generateActions(prefix: string): ActionValue {
		return {
			init: this.actionTypes[this.joinWithUpperCase(prefix, 'Init')],
			success: this.actionTypes[
				this.joinWithUpperCase(prefix, 'Success')
			],
			failure: this.actionTypes[
				this.joinWithUpperCase(prefix, 'Failure')
			],
			reset: this.actionTypes[this.joinWithUpperCase(prefix, 'Reset')]
		};
	}

	private joinWithUpperCase(...words: string[]) {
		return words.join(this.delimiter).toUpperCase();
	}
}
