import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { Spring, config } from 'react-spring/renderprops';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Header } from 'semantic-ui-react';

import { BaseAccount, Static } from 'evm-lite-lib';

import { Store } from '../redux';
import { AccountsFetchOnePayLoad } from '../redux/actions/Accounts';
import {
	AccountsFetchOneReducer,
	AccountsFetchAllReducer
} from '../redux/reducers/Accounts';
import { ConfigLoadReducer } from '../redux/reducers/Config';

import { Jumbo, PaddedContent } from '../components/Styling';

import LoadingButton from '../components/LoadingButton';
import AccountUnlock from '../components/AccountUnlock';
import FloatingButton from '../components/FloatingButton';
import Transaction, { SentTransaction } from '../components/Transaction';

import redux from '../redux.config';

import Misc from '../classes/Misc';

const Transactions = styled.div`
	&.label {
		margin-right: 10px !important;
	}
`;

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountFetchTask: AccountsFetchOneReducer;
	accountFetchAllTask: AccountsFetchAllReducer;
	configLoadTask: ConfigLoadReducer;
}

interface DispatchProps {
	handleFetchAccount: (payload: AccountsFetchOnePayLoad) => BaseAccount;
}

interface OwnProps {
	account?: BaseAccount;
	match: any;
	location: any;
}

interface TimeStampedAccount extends BaseAccount {
	lastUpdated: string;
}

interface State {
	account: TimeStampedAccount;
	transactions: SentTransaction[];
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

const transactions: SentTransaction[] = [
	{
		id: 1,
		from: '0X89ACCD6B63D6EE73550ECA0CBA16C2027C13FDA6',
		to: '0x49a79da766fe9ac55e2c19e61c5f90c3fc40753b',
		value: 500000,
		status: true,
		incoming: true
	},
	{
		id: 2,
		from: '0X89ACCD6B63D6EE73550ECA0CBA16C2027C13FDA6',
		to: '0x49a79da766fe9ac55e2c19e61c5f90c3fc40753b',
		value: 10000,
		status: true,
		incoming: false
	},
	{
		id: 3,
		from: '0X89ACCD6B63D6EE73550ECA0CBA16C2027C13FDA6',
		to: '0x49a79da766fe9ac55e2c19e61c5f90c3fc40753b',
		value: 100000,
		status: false,
		incoming: true
	}
];

class Account extends React.Component<LocalProps, State> {
	public state = {
		transactions,
		account: {
			address: this.props.match.params.address,
			balance: parseInt(
				this.props.match.params.balance.split(',').join(''),
				10
			),
			nonce: parseInt(this.props.match.params.nonce, 10),
			lastUpdated: ''
		}
	};

	public componentWillReceiveProps(nextProps: LocalProps) {
		if (
			nextProps.accountFetchTask.response &&
			!this.props.accountFetchTask.response
		) {
			let newBalance: number = 0;
			const {
				address,
				balance,
				nonce
			} = nextProps.accountFetchTask.response;

			if (typeof balance === 'string') {
				newBalance = parseInt(balance.split(',').join(''), 10);
			} else {
				newBalance = balance;
			}

			this.setState({
				transactions,
				account: {
					address,
					balance: newBalance,
					nonce,
					lastUpdated: new Date().toLocaleString()
				}
			});
		}
	}

	public fetchAccount = async () => {
		if (this.props.configLoadTask.response) {
			this.setState({
				transactions: []
			});
			await this.props.handleFetchAccount({
				keystoreDirectory: this.props.configLoadTask.response.storage
					.keystore,
				address: this.props.match.params.address
			});
		} else {
			this.props.alert.info(
				'Looks like there was a problem reading the config file.'
			);
		}
	};

	public render() {
		const { accountFetchTask } = this.props;
		const { account, transactions } = this.state;

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
								{Static.cleanAddress(account.address)}
								<Header.Subheader>
									Last Updated: {account.lastUpdated || 'N/A'}
								</Header.Subheader>
							</Header>
						)}
					</Spring>
					<Header as="h2" floated="right">
						Nonce
						{(accountFetchTask.response && (
							<Spring
								from={{
									nonce: account.nonce - 250
								}}
								to={{
									nonce: account.nonce
								}}
								config={config.wobbly}
							>
								{props => (
									<Header.Subheader>
										{Misc.integerWithCommas(
											Math.round(props.nonce)
										)}
									</Header.Subheader>
								)}
							</Spring>
						)) || (
							<Header.Subheader>
								{Misc.integerWithCommas(
									account.balance.toString()
								)}
							</Header.Subheader>
						)}
					</Header>
					<Header as="h2" floated="right">
						Balance
						{(accountFetchTask.response && (
							<Spring
								from={{
									balance: account.balance - 250
								}}
								to={{
									balance: account.balance
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
						)) || (
							<Header.Subheader>
								{Misc.integerWithCommas(
									account.balance.toString()
								)}
							</Header.Subheader>
						)}
					</Header>
				</Jumbo>
				<br />
				{transactions.length !== 0 && (
					<PaddedContent>
						<Header as="h3">Transactions</Header>
					</PaddedContent>
				)}
				<Transactions>
					{transactions.length !== 0 &&
						transactions.map((tx, i) => {
							const transaction = tx as SentTransaction;
							return (
								<Spring
									key={transaction.id}
									from={{
										marginRight: -Misc.MARGIN_CONSTANT,
										opacity: 0
									}}
									to={{
										marginRight: 0,
										opacity: 1
									}}
									config={config.wobbly}
								>
									{props => (
										<Transaction
											style={props}
											key={transaction.id}
											transaction={transaction}
										/>
									)}
								</Spring>
							);
						})}
				</Transactions>
				<AccountUnlock />
				<FloatingButton bottomOffset={57}>
					<LoadingButton
						onClickHandler={this.fetchAccount}
						isLoading={accountFetchTask.isLoading}
					/>
				</FloatingButton>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accountFetchTask: store.accounts.fetchOne,
	configLoadTask: store.config.load,
	accountFetchAllTask: store.accounts.fetchAll
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleFetchAccount: payload =>
		dispatch(redux.actions.accounts.fetchOne.handlers.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Account));
