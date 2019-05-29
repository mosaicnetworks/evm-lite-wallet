import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { Spring, config, Transition } from 'react-spring/renderprops';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Header } from 'semantic-ui-react';
import { BaseAccount, Static } from 'evm-lite-lib';
import { RouteComponentProps } from 'react-router-dom';

import { Store } from 'src/store';
import { AccountsState, get } from '../modules/accounts';
import { Jumbo, PaddedContent } from '../components/Styling';

import LoadingButton from '../components/LoadingButton';
import AccountUnlock from '../components/AccountUnlock';
import FloatingButton from '../components/FloatingButton';
import Banner from '../components/Banner';
import Transaction, { SentTransaction } from '../components/Transaction';

import Misc from '../classes/Misc';

const Transactions = styled.div`
	&.label {
		margin-right: 10px !important;
	}
`;

interface RouterParams {
	address: string;
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accounts: AccountsState;
}

interface DispatchProps {
	get: (address: string) => BaseAccount;
}

interface OwnProps {
	empty?: null;
}

interface TimeStampedAccount extends BaseAccount {
	lastUpdated: string;
}

interface State {
	account: TimeStampedAccount;
	transactions: SentTransaction[];
}

type LocalProps = OwnProps &
	StoreProps &
	DispatchProps &
	AlertProps &
	RouteComponentProps<RouterParams>;

const transactions: SentTransaction[] = [
	// {
	// 	id: 1,
	// 	from: '0X89ACCD6B63D6EE73550ECA0CBA16C2027C13FDA6',
	// 	to: '0x49a79da766fe9ac55e2c19e61c5f90c3fc40753b',
	// 	value: 500000,
	// 	status: true,
	// 	incoming: true
	// },
	// {
	// 	id: 2,
	// 	from: '0X89ACCD6B63D6EE73550ECA0CBA16C2027C13FDA6',
	// 	to: '0x49a79da766fe9ac55e2c19e61c5f90c3fc40753b',
	// 	value: 10000,
	// 	status: true,
	// 	incoming: false
	// },
	// {
	// 	id: 3,
	// 	from: '0X89ACCD6B63D6EE73550ECA0CBA16C2027C13FDA6',
	// 	to: '0x49a79da766fe9ac55e2c19e61c5f90c3fc40753b',
	// 	value: 100000,
	// 	status: false,
	// 	incoming: true
	// }
];

class Account extends React.Component<LocalProps, State> {
	public state = {
		transactions,
		account: {
			address: this.props.match.params.address,
			balance: 0,
			nonce: 0,
			lastUpdated: ''
		}
	};

	public componentWillReceiveProps(nextProps: LocalProps) {
		if (
			this.props.accounts.loading.get &&
			!nextProps.accounts.loading.get
		) {
			const accounts = this.props.accounts.all.filter(account => {
				return account.address === this.state.account.address;
			});

			if (!!accounts.length) {
				const account: BaseAccount = accounts[0];

				this.setState({
					account: {
						...account,
						lastUpdated: ''
					}
				});
			}
		}
	}

	public componentDidMount() {
		const { address } = this.props.match.params;

		const accounts = this.props.accounts.all.filter(account => {
			return account.address === address;
		});

		if (!!accounts.length) {
			const account: BaseAccount = accounts[0];

			this.setState({
				account: {
					...account,
					lastUpdated: ''
				}
			});
		}
	}

	public fetchAccount = async () => {
		this.props.get(this.state.account.address);
	};

	public renderAccountUnlockButton = () => {
		const { account } = this.state;
		const { accounts } = this.props;

		if (accounts.unlocked) {
			return null;
		}

		return <AccountUnlock address={account.address} />;
	};

	public render() {
		const { accounts } = this.props;
		const { transactions, account } = this.state;

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
						{(!!accounts.all.length && (
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
						<Header.Subheader>
							{Misc.integerWithCommas(account.balance.toString())}
						</Header.Subheader>
					</Header>
				</Jumbo>
				<Transition
					items={
						!!accounts.unlocked &&
						Static.cleanAddress(accounts.unlocked.address) ===
							Static.cleanAddress(account.address)
					}
					from={{ opacity: 0 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0 }}
					config={config.default}
				>
					{show =>
						show &&
						(props => (
							<Banner color="orange" style={props}>
								This account is currently unlocked and will
								allow you to transfer funds and interact with
								smart contracts without having to provide a
								password.
							</Banner>
						))
					}
				</Transition>

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
				{this.renderAccountUnlockButton()}
				<FloatingButton bottomOffset={57}>
					<LoadingButton
						onClickHandler={this.fetchAccount}
						isLoading={accounts.loading.get}
					/>
				</FloatingButton>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accounts: store.accounts
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	get: address => dispatch(get(address))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Account));
