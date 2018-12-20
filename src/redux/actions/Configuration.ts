import {ConfigSchema} from "evm-lite-lib/tools/classes/Config";

import BaseActions, {ActionCreatorHandlers, ActionInterface, ActionValue} from "../common/BaseActions";


export interface ConfigLoadPayLoad {
    directory: string;
    name: string;
}

interface HandlerSchema {
    load: ActionCreatorHandlers<ConfigLoadPayLoad, ConfigSchema, string>
    save: ActionCreatorHandlers<ConfigSchema, string, string>
}

interface ActionSchema extends ActionInterface {
    load: ActionValue;
    save: ActionValue;
}

class Configuration extends BaseActions<HandlerSchema, ActionSchema> {

    public handlers: HandlerSchema;

    constructor() {
        super(Configuration.name);

        this.prefixes = [
            'Load',
            'Save'
        ];

        this.handlers = {
            load: this.generateHandlers<ConfigLoadPayLoad, ConfigSchema, string>('Load'),
            save: this.generateHandlers<ConfigSchema, string, string>('Save'),
        };
    }

}

export default Configuration