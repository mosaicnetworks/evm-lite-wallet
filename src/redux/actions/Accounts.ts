import BaseActions, {ActionCreatorHandlers, ActionInterface, ActionValue} from "../common/BaseActions";

export interface AccountsDecryptPayload {
    address: string;
    password: string;
}

interface HandlerSchema {
    decrypt: ActionCreatorHandlers<AccountsDecryptPayload, string, string>;
}

interface ActionSchema extends ActionInterface {
    decrypt: ActionValue;
}

export default class Accounts extends BaseActions<HandlerSchema, ActionSchema> {

    public handlers: HandlerSchema;

    constructor() {
        super(Accounts.name);

        this.prefixes = [
            'Transfer',
            'Decrypt'
        ];

        this.handlers = {
            decrypt: this.generateHandlers<AccountsDecryptPayload, string, string>('Decrypt')
        }
    }

}

