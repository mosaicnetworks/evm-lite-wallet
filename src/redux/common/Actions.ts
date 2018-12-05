import {ActionCreatorHandlers} from "./Handlers";


interface ActionTypes {
    [key: string]: string
}

type Prefixes = string[];

export default class Actions {

    private readonly prefixCollection: Prefixes;
    private readonly typeCollection: ActionTypes;

    constructor(protected identifier: string) {
        this.typeCollection = {};
        this.prefixCollection = [];
    }

    public get types(): ActionTypes {
        return this.typeCollection;
    }

    protected get prefixes(): Prefixes {
        return this.prefixCollection;
    }

    protected set prefixes(value: Prefixes) {
        for (const prefix of value) {
            this.addSimpleActionType(prefix);
        }
    }

    protected handlers = <S, F>(prefix: string): ActionCreatorHandlers<S, F> => ({
        init: () => ({type: this.types[`${prefix.toUpperCase()}_INIT`]}),
        success: (data: S) => ({type: this.types[`${prefix.toUpperCase()}_SUCCESS`], data}),
        failure: (data: F) => ({type: this.types[`${prefix.toUpperCase()}_FAILURE`], data}),
        reset: () => ({type: this.types[`${prefix.toUpperCase()}_RESET`]}),
    });

    private addSimpleActionType(prefix: string) {
        const {typeCollection, identifier} = this;
        typeCollection[`${prefix.toUpperCase()}_INIT`] = `${identifier.toUpperCase()}_${prefix.toUpperCase()}_INIT`;
        typeCollection[`${prefix.toUpperCase()}_SUCCESS`] = `${identifier.toUpperCase()}_${prefix.toUpperCase()}_SUCCESS`;
        typeCollection[`${prefix.toUpperCase()}_FAILURE`] = `${identifier.toUpperCase()}_${prefix.toUpperCase()}_FAILURE`;
        typeCollection[`${prefix.toUpperCase()}_RESET`] = `${identifier.toUpperCase()}_${prefix.toUpperCase()}_RESET`;
    }

}