import {Account, Controller, V3JSONKeyStore} from 'evm-lite-lib';

import {EVMLThunkAction} from '..';
import Actions from "../common/Actions";


export interface DecryptionParams {
    v3JSONKeystore: V3JSONKeyStore;
    password: string;
}

export interface TransferParams extends DecryptionParams {
    tx: {
        from: string;
        to: string;
        value: string;
        gas: string;
        gasprice: string;
        nonce: number;
        chainId?: number;
    },
}

export default class Accounts extends Actions {

    private connection = new Controller('127.0.0.1');

    constructor() {
        super(Accounts.name);
        this.prefixes = [
            'Transfer',
            'Decrypt'
        ];
    }

    public handleDecryption = (data: DecryptionParams): EVMLThunkAction<string, string> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('Decrypt');
        dispatch(init());
        return new Promise<string>(((resolve) => {
            setTimeout(() => {
                try {
                    const response = 'Account decryption successful!';
                    Account.decrypt(data.v3JSONKeystore, data.password);
                    dispatch(success(response));
                    resolve(response)
                } catch (e) {
                    const error = 'Unable to decryption account with password provided.';
                    dispatch(failure(error));
                    resolve(error);
                }
            }, 2000);
        }));
    };

    public handleTransfer = (data: TransferParams): EVMLThunkAction<string, string, Promise<void>> => dispatch => {
        const {init, success, failure} = this.handlers<string, string>('Transfer');
        dispatch(init());

        return new Promise<void>((resolve, reject) => {
            const account = Account.decrypt(data.v3JSONKeystore, data.password);
            const tx = {
                from: data.tx.from,
                to: data.tx.to,
                value: parseInt(data.tx.value, 10),
                gas: parseInt(data.tx.gas, 10),
                gasPrice: data.tx.gasprice,
                nonce: data.tx.nonce,
                chainId: 1
            }

            account.signTransaction(tx)
                .then((response: any) => {
                    this.connection.api.sendRawTx(response.rawTransaction)
                        .then((response: any) => {
                            dispatch(success('Transaction submitted: ' + response.txHash))
                            resolve();
                        })
                        .catch(() => {
                            dispatch(failure('Something went wrong while submitting transaction.'))
                            reject()
                        })
                })
                .catch(() => {
                    dispatch(failure('Something went wrong while signing your transaction.'));
                    reject();
                })
        })
    }

}

