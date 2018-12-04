import {ActionCreatorHandlers} from "./Handlers";

export default class Actions {
    public types: {
        [key: string]: string
    };

    public handlers: <S, F>(prefix: string) => ActionCreatorHandlers<S, F>;

    constructor() {
        this.types = {}
    }

    public addSimpleActionType(identifier: string, prefix: string) {
        this.types[`${prefix.toUpperCase()}_INIT`] = `${identifier.toUpperCase()}_${prefix.toUpperCase()}_INIT`;
        this.types[`${prefix.toUpperCase()}_SUCCESS`] = `${identifier.toUpperCase()}_${prefix.toUpperCase()}_SUCCESS`;
        this.types[`${prefix.toUpperCase()}_FAILURE`] = `${identifier.toUpperCase()}_${prefix.toUpperCase()}_FAILURE`;
    }
}