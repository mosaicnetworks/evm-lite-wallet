import BaseActions, {ActionCreatorHandlers, ActionInterface, ActionValue} from "../common/BaseActions";


export interface AppConnectivityPayLoad {
    host: string;
    port: number;
}

interface HandlerSchema {
    directory: ActionCreatorHandlers<string, string, string>
    connectivity: ActionCreatorHandlers<AppConnectivityPayLoad, string, string>
}

interface ActionSchema extends ActionInterface {
    directory: ActionValue;
    connectivity: ActionValue;
}

export default class Application extends BaseActions<HandlerSchema, ActionSchema> {

    public handlers: HandlerSchema;

    constructor() {
        super(Application.name);

        this.prefixes = ['Directory', 'Connectivity'];

        this.handlers = {
            directory: this.generateHandlers<string, string, string>('Directory'),
            connectivity: this.generateHandlers<AppConnectivityPayLoad, string, string>('Connectivity'),
        };
    }


}
