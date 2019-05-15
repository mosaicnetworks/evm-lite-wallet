import * as React from 'react';

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

import LoadingButton from '../components/LoadingButton';
import StatusBar from '../components/StatusBar';
import redux from '../redux.config';

import './styles/Account.css';

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

interface State {
	account: BaseAccount;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

class Account extends React.Component<LocalProps, State> {
	public state = {
		account: {
			address: this.props.match.params.address,
			balance: parseInt(
				this.props.match.params.balance.split(',').join(''),
				10
			),
			nonce: parseInt(this.props.match.params.nonce, 10)
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
				account: {
					address,
					balance: newBalance,
					nonce
				}
			});
		}
	}

	public fetchAccount = async () => {
		if (this.props.configLoadTask.response) {
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
		const { account } = this.state;

		return (
			<React.Fragment>
				<div className="jumbo">
					<Spring
						from={{
							marginLeft: -50,
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
									Last Updated: 12/12/12 12:32am
								</Header.Subheader>
							</Header>
						)}
					</Spring>
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
										{numberWithCommas(
											Math.round(props.balance)
										)}
									</Header.Subheader>
								)}
							</Spring>
						)) || (
							<Header.Subheader>
								{numberWithCommas(account.balance.toString())}
							</Header.Subheader>
						)}
					</Header>
				</div>
				<div className="page-padding" />
				<StatusBar>
					<LoadingButton
						onClickHandler={this.fetchAccount}
						isLoading={accountFetchTask.isLoading}
					/>
				</StatusBar>
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
