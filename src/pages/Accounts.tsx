import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Header } from 'semantic-ui-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { BaseAccount, ConfigSchema } from 'evm-lite-lib';

import {
	AccountsFetchAllPayLoad,
	AccountsFetchAllReducer,
	Store
} from '../redux';

import redux from '../redux.config';

import Account from '../components/Account';
import LoadingButton from '../components/LoadingButton';

import './styles/Accounts.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountsFetchAllTask: AccountsFetchAllReducer;
	config: ConfigSchema | null;
}

interface DispatchProps {
	handleFetchAllAccounts: (payload: AccountsFetchAllPayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Accounts extends React.Component<LocalProps, any> {
	public componentWillUpdate(
		nextProps: Readonly<LocalProps>,
		nextState: Readonly<any>,
		nextContext: any
	): void {
		if (
			!this.props.accountsFetchAllTask.response &&
			nextProps.accountsFetchAllTask.response
		) {
			nextProps.alert.success('Local accounts refreshed.');
		}

		if (
			!this.props.accountsFetchAllTask.error &&
			nextProps.accountsFetchAllTask.error
		) {
			nextProps.alert.error(nextProps.accountsFetchAllTask.error);
		}
	}

	public handleRefreshAccounts = () => {
		if (this.props.config) {
			this.props.handleFetchAllAccounts({
				keystoreDirectory: this.props.config.storage.keystore
			});
		} else {
			this.props.alert.info(
				'Looks like there was a problem reading the config file.'
			);
		}
	};

	public render() {
		const { accountsFetchAllTask } = this.props;
		return (
			<React.Fragment>
				<Header as="h2" className={'header-section-buttons'}>
					<Header.Content>
						<LoadingButton
							isLoading={accountsFetchAllTask.isLoading}
							onClickHandler={this.handleRefreshAccounts}
							right={true}
						/>
					</Header.Content>
				</Header>
				<div className={'page'}>
					<TransitionGroup>
						{accountsFetchAllTask.response &&
							accountsFetchAllTask.response.map(
								(account: BaseAccount) => {
									return (
										<CSSTransition
											key={account.address}
											in={true}
											appear={
												!this.props.accountsFetchAllTask
													.isLoading
											}
											timeout={2000}
											classNames="slide1"
										>
											<Account
												key={account.address}
												account={account}
											/>
										</CSSTransition>
									);
								}
							)}
					</TransitionGroup>
					{!accountsFetchAllTask.isLoading &&
						accountsFetchAllTask.error && (
							<div className={'error_message'}>
								{accountsFetchAllTask.error}
							</div>
						)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accountsFetchAllTask: store.accounts.fetchAll,
	config: store.config.load.response
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleFetchAllAccounts: payload =>
		dispatch(redux.actions.accounts.fetchAll.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
