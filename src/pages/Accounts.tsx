import * as React from 'react';

import {connect} from 'react-redux';
import {withAlert} from "react-alert";
import {Divider, Header, Icon} from "semantic-ui-react";

import {BaseAccount, DefaultProps, keystore, Store, transaction} from "../redux";

import Account from '../components/account/Account';
import AccountCreate from "../components/account/AccountCreate";
import AccountImport from "../components/account/AccountImport";
import LoadingButton from "../components/LoadingButton";

import './styles/Accounts.css';


export interface AccountsLocalProps extends DefaultProps {
    // redux states
    error: string
    isLoading: boolean;
    response: BaseAccount[],
    dataDirectory: any;

    // thunk action handlers
    handleFetchLocalAccounts: () => Promise<BaseAccount[]>,
    handleRefreshTXHistory: (dir: string) => Promise<any>,
}

class Accounts extends React.Component<AccountsLocalProps, any> {
    public handleRefreshAccounts = () => {
        this.props.handleFetchLocalAccounts()
            .then(accounts => {
                accounts.length ?
                    this.props.alert.success('Accounts refresh successful!') :
                    this.props.alert.error('No Accounts detected!')
            })
            .then(() => this.props.handleRefreshTXHistory(this.props.dataDirectory.response))

    };

    public render() {
        const {error, response, isLoading} = this.props;
        return (
            <React.Fragment>
                <Header as='h2'>
                    <Icon name='users'/>
                    <Header.Content>
                        Accounts
                        <Header.Subheader>These accounts are read from the keystore specified in the config file.</Header.Subheader>
                    </Header.Content>
                    <Divider />
                    <Header.Content>
                        <AccountCreate/>
                        <AccountImport/>
                        <LoadingButton isLoading={isLoading} onClickHandler={this.handleRefreshAccounts} right={true}/>
                    </Header.Content>
                </Header>
                <Divider hidden={true}/>
                <div className={'page'}>
                    {response && response.map((account: BaseAccount) => {
                        return <Account key={account.address} account={account}/>
                    })}
                    {!isLoading && error && <div className={"error_message"}>{error}</div>}
                </div>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    ...store.keystore.fetch,
    dataDirectory: store.app.dataDirectory
});
const mapsDispatchToProps = (dispatch: any) => ({
    handleFetchLocalAccounts: () => dispatch(keystore.handleFetch()),
    handleRefreshTXHistory: (datadir: string) => dispatch(transaction.handleListTransactionHistories(datadir)),
});

export default connect(mapStoreToProps, mapsDispatchToProps)(withAlert(Accounts));