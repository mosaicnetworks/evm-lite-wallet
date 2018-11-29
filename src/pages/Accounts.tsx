import * as React from 'react';

import {connect} from 'react-redux';
import {Divider, Header} from "semantic-ui-react";

import {accounts, BaseAccount, DefaultProps, Store} from "../redux";

import Account from '../components/account/Account';
import AccountCreate from "../components/account/AccountCreate";
import AccountImport from "../components/account/AccountImport";

import './styles/Accounts.css';
import LoadingButton from "../components/LoadingButton";

export interface AccountsLocalProps extends DefaultProps {
    accounts: BaseAccount[],
    error: string
    handleFetchLocalAccounts: () => void,
    isLoading: boolean;
}

class Accounts extends React.Component<AccountsLocalProps, any> {
    public handleRefreshAccounts = () => {
        this.props.handleFetchLocalAccounts();
    };

    public render() {
        const {error, accounts, isLoading} = this.props;
        return (
            <React.Fragment>
                <Header as={"h2"}>
                    Accounts
                    <Header.Subheader>
                        These accounts are read from the keystore specified in the config file.
                        <br/><br/>
                        <AccountCreate/>
                        <AccountImport/>
                        <LoadingButton isLoading={isLoading} onClickHandler={this.handleRefreshAccounts} right={true}/>
                    </Header.Subheader>
                </Header>
                <Divider hidden={true}/>
                <div className={'page'}>
                    {!isLoading && !error && accounts && accounts.map((account: BaseAccount) => {
                        return <Account key={account.address} account={account}/>
                    })}
                    {!isLoading && error && <div className={"error_message"}>{error}</div>}
                </div>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    isLoading: store.accounts.fetch.isLoading,
    accounts: store.accounts.fetch.response,
    error: store.accounts.fetch.error,
});
const mapsDispatchToProps = (dispatch: any) => ({
    handleFetchLocalAccounts: () => dispatch(accounts.handleFetchLocalAccounts()),
});

export default connect(mapStoreToProps, mapsDispatchToProps)(Accounts);