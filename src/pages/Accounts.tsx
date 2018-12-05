import * as React from 'react';

import {connect} from 'react-redux';
import {Divider, Header, Icon} from "semantic-ui-react";

import {BaseAccount, DefaultProps, keystore, Store} from "../redux";

import Account from '../components/account/Account';
import AccountCreate from "../components/account/AccountCreate";
import AccountImport from "../components/account/AccountImport";

import './styles/Accounts.css';
import LoadingButton from "../components/LoadingButton";
import {withAlert} from "react-alert";

export interface AccountsLocalProps extends DefaultProps {
    error: string
    isLoading: boolean;
    response: BaseAccount[],
    handleFetchLocalAccounts: () => Promise<BaseAccount[]>,
}

class Accounts extends React.Component<AccountsLocalProps, any> {
    public handleRefreshAccounts = () => {
        this.props.handleFetchLocalAccounts()
            .then(accounts => {
                accounts.length ?
                    this.props.alert.success('Accounts refresh successful!') :
                    this.props.alert.error('No Accounts detected!')
            })
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
                    {!isLoading && !error && response && response.map((account: BaseAccount) => {
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
});
const mapsDispatchToProps = (dispatch: any) => ({
    handleFetchLocalAccounts: () => dispatch(keystore.handleFetch()),
});

export default connect(mapStoreToProps, mapsDispatchToProps)(withAlert(Accounts));