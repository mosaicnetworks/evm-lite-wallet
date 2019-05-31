import * as React from 'react';

import Highlight from 'react-highlight';
import styled from 'styled-components';

import { BaseAccount, EVM, Static, TX } from 'evm-lite-lib';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { config, Transition } from 'react-spring/renderprops';
import {
	Button,
	Form,
	Grid,
	Header,
	Input,
	Message,
	Icon
} from 'semantic-ui-react';

import { PaddedContent } from '../components/Styling';

import { Store } from 'src/store';

import { AccountsState, transfer } from '../modules/accounts';
import { ConfigurationState } from '../modules/configuration';

const Content = styled.div`
	padding: 12px;
	margin: 20px;
	margin-top: 10px;
	margin-bottom: 40px;
`;

const Fields = styled(Grid.Column)`
	background: #fff;
	padding: 20px !important;

	& .ui.input {
		display: block !important;
		margin: 7px;
		margin-left: 0;
	}
`;

const Details = styled(Grid.Column)`
	padding: 0 !important;
	background: #fff;
	margin-left: 10px;
	overflow-x: hidden;

	& * {
		word-wrap: break-word !important;
	}
`;

const DetailsHeader = styled.div`
	padding: 15px;
	font-size: 15px;
	font-weight: bold;
	background: #fbfbfb;

	& span {
		font-weight: normal !important;
	}
`;

const DetailsContent = styled.div`
	padding: 20px;
`;

interface AlertProps {
	alert: InjectedAlertProp;
}

interface DispatchProps {
	transfer: (
		from: EVM.Address,
		to: EVM.Address,
		value: EVM.Value,
		gas: EVM.Gas,
		gasPrice: EVM.GasPrice
	) => Promise<string>;
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
			to: '0x550fed8c69a109d7197b9d95debb771618d11a69',
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

	public handleSendTransaction = () => {
		const { fields } = this.state;

		this.props.transfer(
			this.props.account.address,
			fields.to,
			fields.value,
			fields.gas,
			fields.gasPrice
		);
	};

	public fetchReceipt = () => {
		// pass
	};

	// On change functions
	public onChangeTo = (e: any, { value }: { value: string }) => {
		this.setState({
			...this.state,
			fields: {
				...this.state.fields,
				to: value
			}
		});
	};

	public render() {
		const { fields } = this.state;
		const { account, accounts } = this.props;

		let allowTransfer: boolean = false;

		if (accounts.unlocked) {
			allowTransfer =
				Static.cleanAddress(accounts.unlocked.address) ===
				Static.cleanAddress(account.address);
		}

		return (
			<React.Fragment>
				<PaddedContent>
					<Header as="h3">Make a Transfer</Header>
				</PaddedContent>
				<Content>
					<Grid columns="equal">
						<Fields
							width={
								!!accounts.transactions.lastestReceipt &&
								allowTransfer
									? 6
									: 16
							}
						>
							{!allowTransfer && (
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
								<Input
									value={
										'0x550fed8c69a109d7197b9d95debb771618d11a69'
									}
									placeholder="To Address"
									disabled={!allowTransfer}
									onChange={(_, { value }) =>
										this.setState({
											fields: {
												...this.state.fields,
												to: value
											}
										})
									}
								/>
								<Input
									placeholder="Value"
									type="number"
									disabled={!allowTransfer}
									onChange={(_, { value }) =>
										this.setState({
											fields: {
												...this.state.fields,
												value: parseInt(value, 10)
											}
										})
									}
								/>
								<Input
									defaultValue={fields.gas}
									placeholder="Gas"
									disabled={!allowTransfer}
									type="number"
									onChange={(_, { value }) =>
										this.setState({
											fields: {
												...this.state.fields,
												gas: parseInt(value, 10)
											}
										})
									}
								/>
								<Input
									defaultValue={fields.gasPrice}
									disabled={!allowTransfer}
									placeholder="Gas Price"
									type="number"
									onChange={(_, { value }) =>
										this.setState({
											fields: {
												...this.state.fields,
												gasPrice: parseInt(value, 10)
											}
										})
									}
								/>
								<Button
									color="green"
									disabled={!allowTransfer}
									loading={accounts.loading.transfer}
									content="Send"
									onClick={this.handleSendTransaction}
								/>
							</Form>
						</Fields>
						<Transition
							items={
								!!accounts.transactions.lastestReceipt &&
								allowTransfer
							}
							from={{ opacity: 0 }}
							enter={{ opacity: 1 }}
							leave={{ opacity: 0 }}
							config={config.stiff}
						>
							{show =>
								show &&
								(props => (
									<Details style={props}>
										<DetailsHeader>
											Transaction Hash:{' '}
											<span>
												{accounts.transactions
													.lastestReceipt &&
													accounts.transactions
														.lastestReceipt
														.transactionHash}
											</span>
										</DetailsHeader>
										<DetailsContent>
											<b>Details: </b>
											<Highlight className="javascript">
												{JSON.stringify(
													this.state.fields,
													null,
													4
												)}
											</Highlight>

											<b>Receipt: </b>
											<Highlight className="javascript">
												{JSON.stringify(
													accounts.transactions
														.lastestReceipt,
													null,
													4
												)}
											</Highlight>
										</DetailsContent>
									</Details>
								))
							}
						</Transition>
					</Grid>
				</Content>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	config: store.config,
	accounts: store.accounts
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	transfer: (from, to, value, gas, gasPrice) =>
		dispatch(transfer(from, to, value, gas, gasPrice))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<LocalProps>(AccountTransfer));
