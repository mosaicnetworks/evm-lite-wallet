import * as React from 'react';

import { Link } from 'react-router-dom';
import { Card, Label } from 'semantic-ui-react';

import { BaseAccount } from 'evm-lite-lib';

import './styles/AccountCard.css';

interface OwnProps {
	account: BaseAccount;
}

type LocalProps = OwnProps;

class Account extends React.Component<LocalProps, any> {
	public state = {
		showTxHistory: true
	};

	public onTXHistoryClick = () => {
		this.setState({ showTxHistory: !this.state.showTxHistory });
	};

	public render() {
		return (
			<Card fluid={false}>
				<Card.Content className={'sticky-account-heading'}>
					<Card.Header className={'address'}>
						<Link to={'/account/' + this.props.account.address}>
							{this.props.account.address}
						</Link>
					</Card.Header>
				</Card.Content>
				<Card.Content
					extra={true}
					className={'sticky-account-heading-buttons'}
				>
					<div className="ui small one buttons">
						<Label color={'green'} basic={true}>
							Balance
							<Label.Detail>
								{this.props.account.balance}
							</Label.Detail>
						</Label>
						<Label basic={true}>
							Nonce
							<Label.Detail>
								{this.props.account.nonce}
							</Label.Detail>
						</Label>
					</div>
				</Card.Content>
			</Card>
		);
	}
}

export default Account;
