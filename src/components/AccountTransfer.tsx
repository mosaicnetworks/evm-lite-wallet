import * as React from 'react';

import Highlight from 'react-highlight';
import styled from 'styled-components';

import { BaseAccount, TX } from 'evm-lite-lib';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Icon, Message } from 'semantic-ui-react';

import { PaddedContent } from '../components/Styling';

import { Store } from 'src/store';
import { LoadingButton } from '.';

import { AccountsState } from '../modules/accounts';
import { ConfigurationState } from '../modules/configuration';

const TransferContent = styled.div`
	padding: 12px;
	margin: 20px;
	margin-top: 10px;
	margin-bottom: 40px;
`;

const TransferDetails = styled(Grid.Column)`
	padding: 20px !important;
	background: #fff;
`;

const Right = styled.div`
	float: right;
`;

interface AlertProps {
	alert: InjectedAlertProp;
}

interface DispatchProps {
	empty?: null;
}

interface StoreProps {
	config: ConfigurationState;
	accounts: AccountsState;
}

interface OwnProps {
	account: BaseAccount;
}

interface State {
	fields: TX;
}

type LocalProps = StoreProps & DispatchProps & OwnProps & AlertProps;

class AccountTransfer extends React.Component<LocalProps, State> {
	public state = {
		fields: {
			from: this.props.account.address,
			to: '',
			value: 0,
			gas: 10000000,
			gasPrice: 0
		}
	};

	public componentDidMount() {
		if (!!Object.keys(this.props.config.data).length) {
			const config = this.props.config.data;

			this.setState({
				fields: {
					...this.state.fields,
					gas: config.defaults.gas,
					gasPrice: config.defaults.gasPrice
				}
			});
		}
	}

	public fetchReceipt = () => {
		// pass
	};

	public render() {
		const { fields } = this.state;
		const disableTransfer =
			this.props.account.address !==
			(this.props.accounts.unlocked &&
				this.props.accounts.unlocked.address);

		const TransferForm = styled(Grid.Column)`
			/* opacity: ${disableTransfer ? 0.8 : 1}; */
			background: #${disableTransfer ? 'fbfbfb' : 'fff'};
			padding: 20px !important;
		`;

		return (
			<React.Fragment>
				<PaddedContent>
					<Header as="h3">Make a Transfer</Header>
				</PaddedContent>
				<TransferContent>
					<Grid columns="equal">
						<TransferForm width="6">
							{disableTransfer && (
								<Message icon={true} info={true}>
									<Icon name="lock" />
									<Message.Content>
										<Message.Header>
											Unlock Account
										</Message.Header>
										You cannot make a transfer from this
										account unless you unlock it using the
										button on the bottom right.
									</Message.Content>
								</Message>
							)}
							<Form>
								<Form.Input
									disabled={disableTransfer}
									placeholder="To Address"
								/>
								<Form.Input
									disabled={disableTransfer}
									placeholder="Value"
									type="number"
								/>
								<Form.Input
									disabled={disableTransfer}
									type="number"
									placeholder="Gas"
									defaultValue={fields.gas}
								/>
								<Form.Input
									disabled={disableTransfer}
									type="number"
									placeholder="Gas Price"
									defaultValue={fields.gasPrice}
								/>
								<Form.Button
									disabled={disableTransfer}
									color="green"
									content="Send"
								/>
							</Form>
						</TransferForm>
						<TransferDetails>
							<Header as="h4" floated="left">
								Transaction Hash:
								<Header.Subheader>
									0x5c3e95864f7eb2fd0789848f0a3368aa67b8439c
								</Header.Subheader>
							</Header>
							<Right>
								<LoadingButton
									isLoading={false}
									onClickHandler={this.fetchReceipt}
								/>
								<Button color="yellow" content="Clear" />
							</Right>
							<br />
							<br />
							<Header as="h4">
								Transaction:
								<Header.Subheader>
									<Highlight className="javascript">
										{JSON.stringify(fields, null, 4)}
									</Highlight>
								</Header.Subheader>
							</Header>
							<Header as="h4">
								Status:{' '}
								<Icon color="green" name="circle" size="tiny" />
							</Header>
							<Header as="h4">
								Receipt:
								<Header.Subheader>
									<Highlight className="javascript">
										{JSON.stringify(
											{
												id: 1,
												from:
													'0X89ACCD6B63D6EE73550ECA0CBA16C2027C13FDA6',
												to:
													'0x49a79da766fe9ac55e2c19e61c5f90c3fc40753b',
												value: 500000,
												status: true,
												incoming: true
											},
											null,
											4
										)}
									</Highlight>
								</Header.Subheader>
							</Header>
						</TransferDetails>
					</Grid>
				</TransferContent>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	config: store.config,
	accounts: store.accounts
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<LocalProps>(AccountTransfer));
