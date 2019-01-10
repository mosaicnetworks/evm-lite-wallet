import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button, Form, Modal } from 'semantic-ui-react';
import { BaseAccount } from 'evm-lite-lib';

import {
	AccountsDecryptPayload,
	AccountsDecryptReducer,
	AccountsTransferPayLoad,
	AccountsTransferReducer,
	ConfigLoadReducer,
	Store
} from '../../../redux';

import redux from '../../../redux.config';


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

class AccountTransfer extends React.Component<LocalProps, State> {
	public state = {
		open: false,
		transferErrorMessage: true,
		transferSuccessMessage: true,
		fields: {
			to: '',
			value: '',
			gas: '',
			gasPrice: '',
			password: ''
		}
	};

	public componentWillReceiveProps(nextProps: Readonly<LocalProps>, nextContext: any): void {
		if (!this.props.configLoadTask.response && nextProps.configLoadTask.response) {
			this.setState({
				fields: {
					...this.state.fields,
					gas: nextProps.configLoadTask.response.defaults.gas.toString(),
					gasPrice: nextProps.configLoadTask.response.defaults.gasPrice.toString()
				}
			});
		}

		if (!this.props.accountTransferTask.response && !!nextProps.accountTransferTask.response &&
			parseInt(this.state.fields.gasPrice, 10) >= 0 && !this.state.transferSuccessMessage) {
			this.props.alert.success('Transfer request submitted.');
			this.setState({
				transferSuccessMessage: true
			});
			this.close();
		}

		if (!this.props.accountTransferTask.error &&
			!!nextProps.accountTransferTask.error &&
			!this.state.transferErrorMessage) {
			this.setState({
				transferErrorMessage: true
			});
			this.props.alert.error(nextProps.accountTransferTask.error);
		}
	}

	public componentWillUpdate(nextProps: Readonly<LocalProps>, nextState: Readonly<State>, nextContext: any): void {
		if (this.props.configLoadTask.response && (!this.state.fields.gas || !this.state.fields.gasPrice)) {
			const { response } = this.props.configLoadTask;

			this.setState({
				fields: {
					...this.state.fields,
					gas: response.defaults.gas.toString(),
					gasPrice: response.defaults.gasPrice.toString()
				}
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
											   defaultValue={fields.gas}/>
									</Form.Field>
									<Form.Field>
										<label>Gas Price</label>
										<input onChange={this.handleOnChangeGasPrice}
											   defaultValue={fields.gasPrice}/>
									</Form.Field>
								</Form.Group>
							</Form>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.close}>Close</Button>
						<Button disabled={this.props.accountTransferTask.isLoading}
								onClick={this.handleTransfer}
								color={'green'}
								loading={this.props.accountTransferTask.isLoading}
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
	handleDecryption: payload => dispatch(redux.actions.accounts.handlers.decrypt.init(payload)),
	handleTransfer: payload => dispatch(redux.actions.accounts.handlers.transfer.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(AccountTransfer));
