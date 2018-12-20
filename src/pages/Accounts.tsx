import * as React from 'react';

import {connect} from 'react-redux';
import {InjectedAlertProp, withAlert} from "react-alert";
import {Divider, Header, Icon} from "semantic-ui-react";

import {BaseAccount, keystore, Store} from "../redux";

import Account from '../components/account/Account';
import AccountCreate from "../components/account/AccountCreate";
import AccountImport from "../components/account/AccountImport";
import LoadingButton from "../components/LoadingButton";

import './styles/Accounts.css';


interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    error: string | null;
    isLoading: boolean;
    response: BaseAccount[] | null,
    dataDirectory: any | null;
}

interface DispatchProps {
    handleFetchLocalAccounts: () => Promise<BaseAccount[]>,
}

interface OwnProps {
    empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Accounts extends React.Component<LocalProps, any> {
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
                        <Header.Subheader>These accounts are read from the keystore specified in the config
                            file.</Header.Subheader>
                    </Header.Content>
                    <Divider/>
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

const mapStoreToProps = (store: Store): StoreProps => ({
    ...store.keystore.fetch,
    dataDirectory: store.app.dataDirectory
});
const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
    handleFetchLocalAccounts: () => dispatch(keystore.handleFetch()),
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));