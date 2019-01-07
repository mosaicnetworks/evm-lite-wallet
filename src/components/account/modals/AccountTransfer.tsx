import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button, Form, Modal } from 'semantic-ui-react';

import { BaseAccount, Store } from '../../../redux';
import { AccountsDecryptReducer, AccountsTransferReducer } from '../../../redux/reducers/Accounts';
import { ConfigLoadReducer } from '../../../redux/reducers/Configuration';

import Accounts, { AccountsDecryptPayload, AccountsTransferPayLoad } from '../../../redux/actions/Accounts';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountDecryptTask: AccountsDecryptReducer;
	accountTransferTask: AccountsTransferReducer;
	configLoadTask: ConfigLoadReducer;
}

interface DispatchProps {
	handleDecryption: (payload: AccountsDecryptPayload) => void;
	handleTransfer: (payload: AccountsTransferPayLoad) => void;
}

interface OwnProps {
	account: BaseAccount;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps

interface State {
	open: boolean;
	transferDisable: boolean;
	transferErrorMessage: boolean;
	transferSuccessMessage: boolean;
	fields: {
		to: string;
		value: string;
		gas: string;
		password: string;
		gasPrice: string;
	};
}

const accounts = new Accounts();

class AccountTransfer extends React.Component<LocalProps, State> {
	public state = {
		open: false,
		transferDisable: false,
		transferErrorMessage: false,
		transferSuccessMessage: false,
		fields: {
			to: '',
			value: '',
			gas: '',
			gasPrice: '',
			password: ''
		}
	};

	public componentWillReceiveProps(nextProps: Readonly<LocalProps>, nextContext: any): void {
		if (!this.props.accountDecryptTask.error && !!nextProps.accountDecryptTask.error &&
			this.state.fields.password) {
			this.props.alert.error('Could not decrypt account with password provided.');
		}

		if (nextProps.configLoadTask.response && (!this.state.fields.gas || this.state.fields.gasPrice)) {
			this.setState({
				fields: {
					...this.state.fields,
					gas: nextProps.configLoadTask.response.defaults.gas.toString(),
					gasPrice: nextProps.configLoadTask.response.defaults.gasPrice.toString()
				}
			});
		}

		if (!this.props.accountDecryptTask.response && !!nextProps.accountDecryptTask.response &&
			this.state.fields.password) {
			this.props.alert.success(nextProps.accountDecryptTask.response);
		}

		if (!this.props.accountTransferTask.response && !!nextProps.accountTransferTask.response &&
			parseInt(this.state.fields.gasPrice, 10) >= 0) {

			this.setState({
				transferSuccessMessage: true
			});

			if (!this.state.transferSuccessMessage) {
				this.props.alert.success('Transfer request submitted.');
			}

			this.close();
		}

		if (!this.props.accountTransferTask.error && !!nextProps.accountTransferTask.error &&
			this.state.fields.gas && this.state.fields.gasPrice && !this.props.accountDecryptTask.response) {

			if (!this.state.transferErrorMessage) {
				this.props.alert.error(nextProps.accountTransferTask.error);
			}

			this.setState({
				transferErrorMessage: true
			});
		}
	}

	public open = () => this.setState({ open: true });
	public close = () => {
		this.setState({ open: false });
	};

	public handleOnChangeToAddress = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				to: e.target.value
			}
		});
	};

	public handleOnChangeValue = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				value: e.target.value
			}
		});
	};

	public handleOnChangeGas = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				gas: e.target.value
			}
		});
	};

	public handleOnChangeGasPrice = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				gasPrice: e.target.value
			}
		});
	};

	public handlePasswordChange = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				password: e.target.value
			}
		});
	};

	public handleTransfer = () => {
		this.setState({
			transferErrorMessage: false,
			transferSuccessMessage: false
		});

		const { fields } = this.state;
		const { account } = this.props;

		for (const field in fields) {
			if (!fields[field]) {
				this.props.alert.error(`All fields must be filled in. Missing '${field}'.`);
				return;
			}
		}

		this.props.handleTransfer({
			tx: {
				to: fields.to,
				from: account.address,
				gas: parseInt(fields.gas, 10),
				gasPrice: parseInt(fields.gasPrice, 10),
				value: parseInt(fields.value, 10)
			},
			password: fields.password
		});
	};

	public render() {
		const { fields } = this.state;

		return (
			<React.Fragment>
				<Modal onClose={this.close} open={this.state.open}
					   trigger={<Button onClick={this.open} basic={false} color='green'>Transfer</Button>}>
					<Modal.Header>Transfer From: {this.props.account.address}</Modal.Header>
					<Modal.Content>
						<Modal.Description>
							<Form>
								<Form.Field>
									<label>Password</label>
									<input type={'password'}
										   onChange={this.handlePasswordChange}/>
								</Form.Field>
								<Form.Group widths={'two'}>
									<Form.Field>
										<label>To</label>
										<input onChange={this.handleOnChangeToAddress}/>
									</Form.Field>
									<Form.Field>
										<label>Value</label>
										<input defaultValue={'0'} onChange={this.handleOnChangeValue}/>
									</Form.Field>
								</Form.Group>
								<Form.Group widths={'two'}>
									<Form.Field>
										<label>Gas</label>
										<input onChange={this.handleOnChangeGas}
											   defaultValue={
												   this.props.configLoadTask.response ?
													   this.props.configLoadTask.response.defaults.gas.toString() :
													   fields.gas
											   }/>
									</Form.Field>
									<Form.Field>
										<label>Gas Price</label>
										<input onChange={this.handleOnChangeGasPrice}
											   defaultValue={
												   this.props.configLoadTask.response ?
													   this.props.configLoadTask.response.defaults.gasPrice.toString() :
													   fields.gasPrice
											   }/>
									</Form.Field>
								</Form.Group>
							</Form>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.close}>Close</Button>
						<Button disabled={this.state.transferDisable}
								onClick={this.handleTransfer}
								color={'green'}
								type='submit'>
							Transfer
						</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accountDecryptTask: store.accounts.decrypt,
	accountTransferTask: store.accounts.transfer,
	configLoadTask: store.config.load
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleDecryption: payload => dispatch(accounts.handlers.decrypt.init(payload)),
	handleTransfer: payload => dispatch(accounts.handlers.transfer.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(AccountTransfer));
