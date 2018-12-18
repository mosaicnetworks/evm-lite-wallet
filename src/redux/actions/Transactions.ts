import {Database} from 'evm-lite-lib';

import {EVMLThunkAction, keystore} from "../index";

import Actions from "../common/BaseActions";


export default class Transactions extends Actions {

    constructor() {
        super(Transactions.name);
        this.prefixes = [
            'History'
        ]
    }

    public handleListTransactionHistories = (data: string): EVMLThunkAction<string, string> =>
        async (dispatch) => {
            const {init, success, failure} = this.handlers<any, string>('History')
            const database = new Database(data, 'db.json');
            dispatch(init());

            return database.transactions.filter()
                .then((txs) => {
                    return dispatch(keystore.handleFetch())
                        .then((accounts) => {
                            const histories: any = {}
                            accounts.forEach(account => {
                                console.log(txs.sender(account.address));
                                histories[account.address] = txs.sender(account.address);
                            })

                            dispatch(success(histories))
                            return histories;
                        })
                })
                .catch(() => {
                    dispatch(failure('Something went wrong fetching history.'))
                })
        }
}

