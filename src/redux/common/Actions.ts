import {ActionCreatorHandlers} from "./Handlers";

export default class Actions {
    public TYPES: {
        [key: string]: string
    };

    public handlers: <S, F>(prefix: string) => ActionCreatorHandlers<S, F>;

    constructor() {
        this.TYPES = {}
    }
}