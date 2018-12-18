import BasicReducerFactory, {IBasicReducer} from "./reducers/BasicReducerFactory";


interface ActionTypes {
    [key: string]: string
}

type ActionPrefixes = string[];

type InitHandler = () => {
    type: string;
}

type ResetHandler = () => {
    type: string;
}

type SuccessHandler<S> = (data: S) => {
    type: string,
    data: S
}

type FailureHandler<F> = (data: F) => {
    type: string,
    data: F
}

interface ActionCreatorHandlers<S, F> {
    init: InitHandler,
    success: SuccessHandler<S>,
    failure: FailureHandler<F>
    reset: ResetHandler
}

type ActionSuffixes = Readonly<'INIT' | 'SUCCESS' | 'FAILURE' | 'RESET'>;

/**
 * Base BaseActions Handler Class
 *
 * @remarks
 * This class is the base actions call which all action handler classes can be built from. It provides some
 * useful function for handling simple REST requests to an API. Also has methods to generate a simple reducer
 * to parse the actions dispatched to redux.
 *
 * @alpha
 */
export default abstract class BaseActions {

    private readonly delimiter = '_';
    private readonly suffixes: ActionSuffixes[] = ['INIT', 'SUCCESS', 'FAILURE', 'RESET'];
    private readonly prefixCollection: ActionPrefixes;
    private readonly actionTypes: ActionTypes;
    private readonly handlerFunctions: {
        [key: string]: <S, F>() => Readonly<ActionCreatorHandlers<S, F>>
    };

    protected constructor(private identifier: string) {
        this.actionTypes = {};
        this.handlerFunctions = {};
        this.prefixCollection = [];
    }

    public get types(): ActionTypes {
        return this.actionTypes;
    }

    protected get prefixes(): Readonly<ActionPrefixes> {
        return this.prefixCollection;
    }

    protected set prefixes(value: ActionPrefixes) {
        const {actionTypes, identifier} = this;

        for (const prefix of value) {
            for (const suffix of this.suffixes) {
                const key = this.joinWithUpperCase(prefix, suffix);
                const val = this.joinWithUpperCase(identifier, key);

                actionTypes[`${key}`] = `${val}`;
            }

            this.handlerFunctions[prefix.toUpperCase()] = <S, F>() => ({
                init: () => ({type: this.types[this.joinWithUpperCase(prefix, this.suffixes[0])]}),
                success: (data) => ({type: this.types[this.joinWithUpperCase(prefix, this.suffixes[1])], data}),
                failure: (data) => ({type: this.types[this.joinWithUpperCase(prefix, this.suffixes[2])], data}),
                reset: () => ({type: this.types[this.joinWithUpperCase(prefix, this.suffixes[3])]}),
            });

            this.prefixCollection.push(prefix.toUpperCase());
        }
    }

    public SimpleReducer<S, F>(prefix: string, initial?: IBasicReducer<S, F>) {
        return BasicReducerFactory<BaseActions, S, F>(this, prefix, initial);
    }

    public handlers<S, F>(prefix: string): Readonly<ActionCreatorHandlers<S, F>> {
        return this.handlerFunctions[prefix.toUpperCase()]<S, F>();
    }

    private joinWithUpperCase(...words: string[]) {
        return words.join(this.delimiter).toUpperCase();
    }

}