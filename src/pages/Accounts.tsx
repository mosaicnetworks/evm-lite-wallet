import * as React from 'react';

import { Spring, config } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Card, Header, Grid } from 'semantic-ui-react';

import { Jumbo } from '../components/Styling';

import LoadingButton from '../components/LoadingButton';
import AccountCard from '../components/AccountCard';
import AccountCreate from '../components/AccountCreate';
import FloatingButton from '../components/FloatingButton';
import Animation from '../components/animations/Animation';

import Misc from '../classes/Misc';

import { AccountsState, list } from '../modules/accounts';
import { ConfigurationState } from '../modules/configuration';
import { Store } from 'src/store';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accounts: AccountsState;
	configuration: ConfigurationState;
}

interface DispatchProps {
	list: () => void;
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

	public handleListAccounts = () => this.props.list();

	public render() {
		const {
			accounts,
			configuration
			// accountUnlockTask
		} = this.props;

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
									{configuration.config.storage &&
										configuration.config.storage.keystore}
								</Header.Subheader>
							</Header>
						)}
					</Spring>
					<Header as="h2" floated="right">
						Accounts
						{!!accounts.accounts.length && (
							<Spring
								delay={0}
								from={{
									accounts: 0
								}}
								to={{
									accounts: accounts.accounts.length || 0
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
						{!!accounts.accounts.length && (
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
						{!!accounts.accounts.length && (
							<Animation direction="right">
								<div>
									<Card.Group centered={true}>
										{accounts.accounts!.map(
											(account, i) => (
												<AccountCard
													unlocked={
														// (accountUnlockTask.response &&
														// 	accountUnlockTask
														// 		.response
														// 		.address ===
														// 		account.address) ||
														false
													}
													key={account.address}
													account={account}
												/>
											)
										)}
									</Card.Group>
								</div>
							</Animation>
						)}
					</Grid.Column>
				</Grid>
				<AccountCreate />
				<FloatingButton bottomOffset={57}>
					<LoadingButton
						isLoading={this.props.accounts.loading.list}
						onClickHandler={this.handleListAccounts}
					/>
				</FloatingButton>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accounts: store.accounts,
	configuration: store.config
	// accountUnlockTask: store.accounts.unlock
});

const mapsDispatchToProps = (dispatch: any): any =>
	bindActionCreators(
		{
			list
		},
		dispatch
	);

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
