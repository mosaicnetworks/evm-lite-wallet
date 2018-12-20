import * as React from 'react';

import {connect} from 'react-redux';
import {InjectedAlertProp, withAlert} from "react-alert";
import {Divider, Header, Icon} from "semantic-ui-react";

import {ConfigSchema} from "evm-lite-lib";

import {BaseAccount, Store} from "../redux";
import {KeystoreListType} from "../redux/reducers/Keystore";

import Account from '../components/account/Account';
import AccountCreate from "../components/account/AccountCreate";
import AccountImport from "../components/account/AccountImport";
import Keystore from '../redux/actions/Keystore';
import LoadingButton from "../components/LoadingButton";

import './styles/Accounts.css';


interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    keystoreListTask: KeystoreListType;
    config: ConfigSchema | null;
}

interface DispatchProps {
    handleListAccountInit: (directory: string) => void,
}

interface OwnProps {
    empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

const keystore = new Keystore();

class Accounts extends React.Component<LocalProps, any> {
    public handleRefreshAccounts = async () => {
        if (this.props.config) {
            const list = this.props.config.storage.keystore.split('/');
            const popped = list.pop();

            if (popped === '/') {
                list.pop();
            }

            const keystoreParentDirectory = list.join('/');

           await this.props.handleListAccountInit(keystoreParentDirectory);

           if (this.props.keystoreListTask.response) {
               this.props.alert.success('Accounts refreshed.');
           }

           if (this.props.keystoreListTask.error) {
               this.props.alert.error(this.props.keystoreListTask.error);
           }
        } else {
            this.props.alert.info('Looks like there was a problem reading the config file.');
        }
    };

    public render() {
        const {keystoreListTask} = this.props;
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
                        <LoadingButton isLoading={keystoreListTask.isLoading}
                                       onClickHandler={this.handleRefreshAccounts}
                                       right={true}/>
                </Header.Content>
                </Header>
                <Divider hidden={true}/>
                <div className={'page'}>
                    {keystoreListTask.response && keystoreListTask.response.map((account: BaseAccount) => {
                        return <Account key={account.address} account={account}/>
                    })}
                    {!keystoreListTask.isLoading &&
                    keystoreListTask.error && <div className={"error_message"}>{keystoreListTask.error}</div>}
                </div>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store): StoreProps => ({
    keystoreListTask: store.keystore.list,
    config: store.config.load.response,
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
    handleListAccountInit: (directory: string) => dispatch(keystore.handlers.list.init({
        directory,
        name: 'keystore',
    })),
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));