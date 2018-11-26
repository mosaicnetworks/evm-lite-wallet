import * as React from 'react';

import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {connect} from 'react-redux';
import {BaseAccount} from 'evml-cli';
import {Divider, Header} from "semantic-ui-react";

import {AccountsActions, DefaultProps, Store} from "../redux/index";

import Account from '../components/account/Account';
import AccountCreate from "../components/account/AccountCreate";
import AccountImport from "../components/account/AccountImport";

import './styles/Accounts.css';


export interface AccountsLocalProps extends DefaultProps {
    accounts: BaseAccount[],
    error: string
    handleFetchLocalAccounts: () => void,
}

class Accounts extends React.Component<AccountsLocalProps, any> {
    public componentWillMount = () => {
        this.props.handleFetchLocalAccounts();
    };

    public render() {
        const {accounts, error} = this.props;

        return (
            <React.Fragment>

                <Header as={"h2"}>
                    Accounts
                    <Header.Subheader>
                        These accounts are read from the keystore specified in the config file.
                        <br/><br/>
                        <AccountCreate />
                        <AccountImport />
                    </Header.Subheader>
                </Header>
                <Divider hidden={true}/>
                <div className={'page'}>
                    {accounts && accounts.map((account: BaseAccount) => {
                        return <Account key={account.address} account={account}/>
                    })}
                    {error && <div className={"error_message"}>{error}</div>}
                </div>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    accounts: store.accounts.fetchEvents.fetchLocalResponse,
    error: store.accounts.fetchEvents.fetchLocalError,
});
const mapsDispatchToProps = (dispatch: ThunkDispatch<Store, any, AnyAction>) => ({
    handleFetchLocalAccounts: () => dispatch(AccountsActions.handleFetchLocalAccounts()),
});

export default connect(mapStoreToProps, mapsDispatchToProps)(Accounts);