import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Divider, Header } from 'semantic-ui-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { ConfigSchema } from 'evm-lite-lib';

import { BaseAccount, Store } from '../redux';
import { KeystoreListReducer } from '../redux/reducers/Keystore';

import Account from '../components/account/Account';
import AccountCreate from '../components/account/modals/AccountCreate';
import AccountImport from '../components/account/modals/AccountImport';
import Keystore from '../redux/actions/Keystore';
import LoadingButton from '../components/modals/LoadingButton';

import './styles/Accounts.css';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	keystoreListTask: KeystoreListReducer;
	config: ConfigSchema | null;
	connectivityError: string | null;
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

	public componentWillUpdate(nextProps: Readonly<LocalProps>, nextState: Readonly<any>, nextContext: any): void {
		if (!this.props.keystoreListTask.response && nextProps.keystoreListTask.response) {
			nextProps.alert.success('Accounts refreshed.');
		}

		if (!this.props.keystoreListTask.error && nextProps.keystoreListTask.error) {
			this.props.alert.error(nextProps.keystoreListTask.error);
		}
	}

	public handleRefreshAccounts = () => {
		if (this.props.config) {
			const list = this.props.config.storage.keystore.split('/');
			const popped = list.pop();

			if (popped === '/') {
				list.pop();
			}

			const keystoreParentDirectory = list.join('/');

			this.props.handleListAccountInit(keystoreParentDirectory);
		} else {
			this.props.alert.info('Looks like there was a problem reading the config file.');
		}
	};

	public render() {
		const { keystoreListTask } = this.props;
		return (
			<React.Fragment>
				<Header as='h2' className={'header-section-buttons'}>
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
					<TransitionGroup>
						{keystoreListTask.response && keystoreListTask.response.map((account: BaseAccount) => {
							return (
								<CSSTransition key={account.address}
											   in={true}
											   appear={!this.props.keystoreListTask.isLoading}
											   timeout={2000}
											   classNames="slide"
								>
									<Account key={account.address} account={account}/>
								</CSSTransition>
							);
						})}
					</TransitionGroup>
					{!keystoreListTask.isLoading &&
					keystoreListTask.error && <div className={'error_message'}>{keystoreListTask.error}</div>}
				</div>

			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	keystoreListTask: store.keystore.list,
	config: store.config.load.response,
	connectivityError: store.app.connectivity.error
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleListAccountInit: (directory: string) => dispatch(keystore.handlers.list.init({
		directory,
		name: 'keystore'
	}))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
