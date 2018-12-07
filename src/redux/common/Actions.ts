import BasicReducerFactory, {BasicReducerState} from "./reducers/BasicReducerFactory";


interface ActionTypes {
    [key: string]: string
}

type ActionsPrefixes = string[];

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

export default class Actions {

    private readonly delimiter = '_';
    private readonly suffixes: string[] = ['INIT', 'SUCCESS', 'FAILURE', 'RESET'];

    private readonly prefixCollection: ActionsPrefixes;
    private readonly actionTypes: ActionTypes;
    private readonly handlerFunctions: {
        [key: string]: <S, F>() => ActionCreatorHandlers<S, F>
    };

    constructor(protected identifier: string) {
        this.actionTypes = {};
        this.prefixCollection = [];
        this.handlerFunctions = {};
    }

    public get types(): ActionTypes {
        return this.actionTypes;
    }

    protected get prefixes(): ActionsPrefixes {
        return this.prefixCollection;
    }

    protected set prefixes(value: ActionsPrefixes) {
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

            this.prefixCollection.push(prefix);
        }
    }


    public SimpleReducer<S, F>(prefix: string, initial?: BasicReducerState<S, F>) {
        return BasicReducerFactory<Actions, S, F>(this, prefix, initial);
    }

    public handlers<S, F>(prefix: string): ActionCreatorHandlers<S, F> {
        return this.handlerFunctions[prefix.toUpperCase()]<S, F>();
    }

    private joinWithUpperCase(...words: string[]) {
        return words.join(this.delimiter).toUpperCase();
    }

}