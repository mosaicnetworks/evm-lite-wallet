import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button, Form, Modal } from 'semantic-ui-react';

import { BaseAccount, Store } from '../../../redux';
import { AccountsDecryptType } from '../../../redux/reducers/Accounts';

import Accounts, { AccountsDecryptPayload } from '../../../redux/actions/Accounts';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountDecryptTask: AccountsDecryptType;
}

interface DispatchProps {
	handleDecryption: (payload: AccountsDecryptPayload) => void;
}

interface OwnProps {
	account: BaseAccount;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps

interface State {
	open: boolean;
	transferDisable: boolean;
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
		transferDisable: true,
		fields: {
			to: '',
			value: '',
			gas: '',
			gasPrice: '',
			password: ''
		}
	};

	public componentWillReceiveProps(nextProps: Readonly<LocalProps>, nextContext: any): void {
		if (!this.props.accountDecryptTask.error && !!nextProps.accountDecryptTask.error) {
			this.props.alert.error('Could not decrypt account with password provided.');
			this.setState({ transferDisable: true });
		}

		if (!this.props.accountDecryptTask.response && !!nextProps.accountDecryptTask.response) {
			this.props.alert.success(nextProps.accountDecryptTask.response);
			this.setState({ transferDisable: false });
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

	public onBlurPassword = () => {
		if (!this.props.accountDecryptTask.response) {
			this.props.handleDecryption({
				address: this.props.account.address,
				password: this.state.fields.password
			});
		}
	};

	public handleTransfer = () => {
		// const {fields} = this.state;
		//
		// const tx = {
		//     from: this.props.account.address,
		//     to: fields.to,
		//     value: fields.value,
		//     gas: fields.gas,
		//     gasprice: fields.gasPrice,
		//     nonce: this.props.account.nonce
		// };
		// const data: TransferParams = {
		//     tx,
		//     password: this.state.password,
		//     v3JSONKeystore: await this.state.v3JSONKeystore,
		// };

		// if (this.props.accountDecryptTask.response) {
		// this.props.handleTransfer(data)
		//     .then(() => {
		//         this.props.alert.success('Transaction submitted!');
		//     })
		//     .catch(() => {
		//         this.props.alert.error('Error transacting!');
		//     });

		// this.close();
		// }
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
									<input type={'password'} onChange={this.handlePasswordChange}
										   onBlur={this.onBlurPassword}/>
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
	accountDecryptTask: store.accounts.decrypt
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleDecryption: payload => dispatch(accounts.handlers.decrypt.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(AccountTransfer));
