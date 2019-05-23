import * as React from 'react';

import { Spring, config } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Card, Header, Grid } from 'semantic-ui-react';

import {
	AccountsFetchAllPayLoad,
	AccountsFetchAllReducer,
	Store,
	ConfigLoadReducer
} from '../redux';

import { NotificationPayLoad } from '../redux/actions/Notifications';
import { Jumbo } from '../components/Styling';

import redux from '../redux.config';

import LoadingButton from '../components/LoadingButton';
import AccountCard from '../components/AccountCard';
import AccountCreate from '../components/AccountCreate';
import FloatingButton from '../components/FloatingButton';
import AnimationRight from '../components/AnimationRight';

import Misc from '../classes/Misc';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountsFetchAllTask: AccountsFetchAllReducer;
	configLoadTask: ConfigLoadReducer;
}

interface DispatchProps {
	handleFetchAllAccounts: (payload: AccountsFetchAllPayLoad) => void;
	appendNewNotification: (payload: NotificationPayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

interface State {
	totalBalance: number;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Accounts extends React.Component<LocalProps, State> {
	public state = {
		totalBalance: 123523432
	};

	public handleShowAlert = () => {
		this.props.alert.info('Testing alert.');
	};

	public handleFetchAllAccounts = () => {
		if (this.props.configLoadTask.response) {
			this.props.handleFetchAllAccounts({
				keystoreDirectory: this.props.configLoadTask.response.storage
					.keystore
			});
		} else {
			this.props.alert.error(
				'Looks like there was a problem reading the config file.'
			);
		}
	};

	public render() {
		const { accountsFetchAllTask, configLoadTask } = this.props;

		return (
			<React.Fragment>
				<Jumbo>
					<Spring
						from={{
							marginLeft: -Misc.MARGIN_CONSTANT,
							opacity: 0
						}}
						to={{
							marginLeft: 0,
							opacity: 1
						}}
						config={config.wobbly}
					>
						{props => (
							<Header style={props} as="h2" floated="left">
								Account Settings
								<Header.Subheader>
									{configLoadTask.response &&
										configLoadTask.response.storage
											.keystore}
								</Header.Subheader>
							</Header>
						)}
					</Spring>
					<Header as="h2" floated="right">
						Accounts
						{accountsFetchAllTask.response && (
							<Spring
								delay={0}
								from={{
									accounts: 0
								}}
								to={{
									accounts:
										accountsFetchAllTask.response.length ||
										0
								}}
								config={config.wobbly}
							>
								{props => (
									<Header.Subheader>
										{Math.round(props.accounts)}
									</Header.Subheader>
								)}
							</Spring>
						)}
					</Header>
					<Header as="h2" floated="right">
						Total Balance
						{accountsFetchAllTask.response && (
							<Spring
								delay={0}
								from={{
									balance: this.state.totalBalance - 300
								}}
								to={{
									balance: this.state.totalBalance
								}}
								config={config.wobbly}
							>
								{props => (
									<Header.Subheader>
										{Misc.integerWithCommas(
											Math.round(props.balance)
										)}
									</Header.Subheader>
								)}
							</Spring>
						)}
					</Header>
				</Jumbo>
				<br />
				<Grid>
					<Grid.Column width="16">
						{accountsFetchAllTask.response && (
							<AnimationRight>
								<div>
									<Card.Group centered={true}>
										{accountsFetchAllTask.response!.map(
											(account, i) => (
												<AccountCard
													key={account.address}
													account={account}
												/>
											)
										)}
									</Card.Group>
								</div>
							</AnimationRight>
						)}
					</Grid.Column>
				</Grid>
				<AccountCreate />
				<FloatingButton bottomOffset={57}>
					<LoadingButton
						isLoading={this.props.accountsFetchAllTask.isLoading}
						onClickHandler={this.handleFetchAllAccounts}
					/>
				</FloatingButton>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accountsFetchAllTask: store.accounts.fetchAll,
	configLoadTask: store.config.load
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleFetchAllAccounts: payload =>
		dispatch(redux.actions.accounts.fetchAll.handlers.init(payload)),
	appendNewNotification: payload =>
		dispatch(
			redux.actions.notifications.notification.handlers.append(payload)
		)
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
