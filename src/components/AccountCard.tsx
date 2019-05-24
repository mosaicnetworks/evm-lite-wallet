import * as React from 'react';

import styled from 'styled-components';

import { Transition, config } from 'react-spring/renderprops';
import { Link } from 'react-router-dom';
import { Card, Label } from 'semantic-ui-react';

import { BaseAccount, Static } from 'evm-lite-lib';

const Address = styled.span`
	word-wrap: break-word !important;
	text-transform: uppercase !important;
	font-weight: 300 !important;
`;

interface OwnProps {
	account: BaseAccount;
	unlocked: boolean;
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
		const newTo = {
			pathname: `/account/${this.props.account.address}/${
				this.props.account.balance
			}/${this.props.account.nonce}`
		};

		return (
			<Card fluid={false}>
				<Card.Content className={'sticky-account-heading'}>
					<Card.Header className={'address'}>
						<Link to={newTo}>
							<Address>
								{Static.cleanAddress(
									this.props.account.address
								)}
							</Address>
						</Link>
					</Card.Header>
				</Card.Content>
				<Card.Content
					extra={true}
					className={'sticky-account-heading-buttons'}
				>
					<div className="ui small two buttons">
						<Transition
							items={this.props.unlocked}
							from={{ opacity: 0 }}
							enter={{ opacity: 1 }}
							leave={{ opacity: 0 }}
							config={config.wobbly}
						>
							{show =>
								show &&
								(props => (
									<Label
										style={props}
										icon="unlock"
										color={'orange'}
										basic={false}
									/>
								))
							}
						</Transition>
						<Label color={'green'} basic={false}>
							Balance
							<Label.Detail>
								{this.props.account.balance}
							</Label.Detail>
						</Label>
						<Label basic={false}>
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
