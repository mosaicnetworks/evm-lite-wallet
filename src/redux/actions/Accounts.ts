import {Account, V3JSONKeyStore} from 'evm-lite-lib';

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

export interface DecryptionParams {
    v3JSONKeystore: V3JSONKeyStore;
    password: string;
}

class Accounts extends Actions {

    constructor() {
        super(Accounts.name);
        this.handlers = <S, F>(prefix: string) => getHandlers<Accounts, S, F>(this, prefix);
        this.prefixes = [
            'transfer',
            'decrypt'
        ];
    }

    public handleDecryption = (data: DecryptionParams): EVMLThunkAction<string, string, void> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('DECRYPT');
        dispatch(init());

        setTimeout(() => {
            try {
                Account.decrypt(data.v3JSONKeystore, data.password);
                dispatch(success('Account decryption successful!'));
                // setTimeout(() => dispatch(reset()), 3000)
            } catch (e) {
                dispatch(failure('Unable to decrypt account with password provided.'));
            }
        }, 2000);
    };

    public handleTransfer = (data: TransferParams): EVMLThunkAction<string, string, void> => dispatch => {
        // Ask to decrypt account
        // Ask for tx details
        // Sign tx locally
        // Send tx
    };

}

export default Accounts
