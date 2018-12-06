import BasicReducerFactory, {BasicReducerState} from "./reducers/BasicReducerFactory";


interface ActionTypes {
    [key: string]: string;
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

    public get types(): ActionTypes {
        return this.typeCollection;
    }

    protected set prefixes(value: ActionsPrefixes) {
        const {typeCollection, identifier} = this;
        for (const prefix of value) {
            typeCollection[`${prefix.toUpperCase()}_INIT`] =
                `${identifier.toUpperCase()}_${prefix.toUpperCase()}_INIT`;
            typeCollection[`${prefix.toUpperCase()}_SUCCESS`] =
                `${identifier.toUpperCase()}_${prefix.toUpperCase()}_SUCCESS`;
            typeCollection[`${prefix.toUpperCase()}_FAILURE`] =
                `${identifier.toUpperCase()}_${prefix.toUpperCase()}_FAILURE`;
            typeCollection[`${prefix.toUpperCase()}_RESET`] =
                `${identifier.toUpperCase()}_${prefix.toUpperCase()}_RESET`;

            this.handlersFunctions[prefix.toUpperCase()] = {
                init: () => ({type: this.types[`${prefix.toUpperCase()}_INIT`]}),
                success: <S>(data: S) => ({type: this.types[`${prefix.toUpperCase()}_SUCCESS`], data}),
                failure: <F>(data: F) => ({type: this.types[`${prefix.toUpperCase()}_FAILURE`], data}),
                reset: () => ({type: this.types[`${prefix.toUpperCase()}_RESET`]}),
            }
        }
    }
    protected readonly prefixCollection: ActionsPrefixes;

    private readonly typeCollection: ActionTypes;
    private readonly handlersFunctions: {
        [key: string]: ActionCreatorHandlers<any, any>
    };

    constructor(protected identifier: string) {
        this.typeCollection = {};
        this.prefixCollection = [];
        this.handlersFunctions = {};
    }

    public handlers<S, F>(prefix: string): ActionCreatorHandlers<S, F> {
        return this.handlersFunctions[prefix.toUpperCase()];
    }

    public SimpleReducer = <S, F>(prefix: string, initial?: BasicReducerState<S, F>) => {
        return BasicReducerFactory<Actions, S, F>(this, prefix, initial);
    };

}