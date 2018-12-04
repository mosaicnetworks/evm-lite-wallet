import getHandlers, {EVMLThunkAction} from '../common/Handlers';
import Actions from "../common/Actions";


export interface TransferParams {
    tx: {
        from: string;
        to: string;
        value: string;
        gas: string;
        gasprice: string;
    },
    password: string;
}

class AccountsActions extends Actions {

    constructor() {
        super();
        this.addSimpleActionType('ACCOUNT', 'TRANSFER');
        this.handlers = <S, F>(prefix: string) => getHandlers<AccountsActions, S, F>(this, prefix);
    }

    public handleTransfer = (data: TransferParams): EVMLThunkAction<string, string, void> => dispatch => {
        // Ask to decrypt account
        // Ask for tx details
        // Sign tx locally
        // Send tx
    };

}

export default AccountsActions
