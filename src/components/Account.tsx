import * as React from 'react';

import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';

import { BaseAccount, SentTX } from 'evm-lite-lib';

import { Store, TransactionHistoryReducer } from '../redux';

import AccountUpdate from './AccountUpdate';
import AccountExport from './AccountExport';
import AccountTransfer from './AccountTransfer';
import AccountHistory from './AccountHistory';

import './styles/Account.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	transactionHistoryTask: TransactionHistoryReducer;
}

interface DispatchProps {
	empty?: null;
}

interface OwnProps {
	account: BaseAccount;
}

type LocalProps = AlertProps & DispatchProps & OwnProps & StoreProps;

const hashCode = function(s) {
	return s.split('').reduce((a: any, b: any) => {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);
};

class Account extends React.Component<LocalProps, any> {
	public state = {
		showTxHistory: true
	};

	public onTXHistoryClick = () => {
		this.setState({ showTxHistory: !this.state.showTxHistory });
	};

	public transactionHistory = (): SentTX[] => {
		const { transactionHistoryTask, account } = this.props;

		if (transactionHistoryTask.response) {
			return transactionHistoryTask.response[account.address] || [];
		} else {
			return [];
		}
	};

	public render() {
		const src =
			'https://www.gravatar.com/avatar/' +
			hashCode(this.props.account.address) +
			'?s=128&d=identicon&r=PG';
		return (
			<Card fluid={true}>
				<Card.Content className={'sticky-account-heading'}>
					<Image src={src} floated="right" size="mini">
						{/*<Icon name="bitcoin" bordered={false} size={'big'}/>*/}
					</Image>
					<Card.Header className={'address'}>
						{this.props.account.address}
					</Card.Header>
					<Card.Description>
						<Label>
							Balance
							<Label.Detail>
								{this.props.account.balance}
							</Label.Detail>
						</Label>
						<Label>
							Nonce
							<Label.Detail>
								{this.props.account.nonce}
							</Label.Detail>
						</Label>
					</Card.Description>
				</Card.Content>
				<Card.Content
					extra={true}
					className={'sticky-account-heading-buttons'}
				>
					<div className="ui small four buttons">
						<Button primary={true} onClick={this.onTXHistoryClick}>
							<Icon name="list" /> Transaction History
						</Button>
						<AccountTransfer account={this.props.account} />
						<AccountUpdate account={this.props.account} />
						<AccountExport account={this.props.account} />
					</div>
				</Card.Content>
				{this.state.showTxHistory ? (
					<Card.Content>
						<AccountHistory
							account={this.props.account}
							txs={this.transactionHistory()}
						/>
					</Card.Content>
				) : null}
			</Card>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	transactionHistoryTask: store.transactions.history
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(Account));
