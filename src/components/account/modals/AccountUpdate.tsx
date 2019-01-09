import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { Button, Divider, Form, Header, Modal } from 'semantic-ui-react';

import { BaseAccount, Store } from '../../../redux';
import { KeystoreUpdateReducer } from '../../../redux/reducers/Keystore';

import Keystore, { KeystoreUpdatePayLoad } from '../../../redux/actions/Keystore';

import '../styles/Account.css';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	keystoreUpdateTask: KeystoreUpdateReducer;
}

interface DispatchProps {
	handleUpdatePassword: (payload: KeystoreUpdatePayLoad) => void;
}

interface OwnProps {
	account: BaseAccount;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps

interface State {
	open: boolean;
	updateDisable: boolean;
	fields: {
		oldPassword: string;
		newPassword: string;
		verifyNewPassword: string;
	}
}

const keystore = new Keystore();

class AccountUpdate extends React.Component<LocalProps, State> {
	public state = {
		open: false,
		updateDisable: true,
		fields: {
			oldPassword: '',
			verifyNewPassword: '',
			newPassword: ''
		}
	};

	public componentWillReceiveProps(nextProps: Readonly<LocalProps>, nextContext: any): void {
		if (!this.props.keystoreUpdateTask.response && !!nextProps.keystoreUpdateTask.response
			&& this.state.fields.oldPassword) {
			nextProps.alert.success('Account updated successfully.');
			this.close();
		}

		if (!this.props.keystoreUpdateTask.error && !!nextProps.keystoreUpdateTask.error
			&& this.state.fields.oldPassword) {
			nextProps.alert.error(nextProps.keystoreUpdateTask.error);
		}
	}

	public open = () => this.setState({ open: true });
	public close = () => {
		this.setState({ open: false, updateDisable: true });
	};

	public handleSave = () => {
		const { newPassword, verifyNewPassword } = this.state.fields;

		if (!newPassword && !verifyNewPassword) {
			this.props.alert.error('The fields cannot be empty!');
			return;
		}

		if (newPassword !== verifyNewPassword) {
			this.props.alert.error('New password & verify password must match!');
		} else {
			this.props.handleUpdatePassword({
				address: this.props.account.address,
				old: this.state.fields.oldPassword,
				new: this.state.fields.newPassword
			});
		}
	};

	public handleChangeOldPassword = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				oldPassword: e.target.value
			}
		});
	};

	public handleChangeNewPassword = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				newPassword: e.target.value
			}
		});
	};

	public handleChangeVerifyNewPassword = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				verifyNewPassword: e.target.value
			}
		});
	};

	public render() {
		return (
			<React.Fragment>
				<Modal open={this.state.open} onClose={this.close}
					   trigger={<Button basic={false} onClick={this.open} color='yellow'>Change Password</Button>}>
					<Modal.Header>Update: {this.props.account.address}</Modal.Header>
					<Modal.Content>
						<Header as={'h4'}>
							Information
						</Header>
						Account will be encrypted with the new password and the current v3JSONKeystore file will be
						overwritten with the new JSON data.
						<br/><br/>
						<Divider/>
						<br/>
						<Modal.Description>
							<Form>
								<Form.Field>
									<label>Old Password: </label>
									<input type={'password'} placeholder='Old Password'
										   onChange={this.handleChangeOldPassword}/>
								</Form.Field>
								<Form.Field>
									<label>New Password</label>
									<input type={'password'} placeholder='New Password'
										   onChange={this.handleChangeNewPassword}/>
								</Form.Field>
								<Form.Field>
									<label>Verify New Password</label>
									<input type={'password'} placeholder='Verify New Password'
										   onChange={this.handleChangeVerifyNewPassword}
									/>
								</Form.Field>
							</Form>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.close}>Close</Button>
						<Button disabled={this.props.keystoreUpdateTask.isLoading}
								loading={this.props.keystoreUpdateTask.isLoading}
								onClick={this.handleSave} color={'green'}
								type='submit'>Update</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	keystoreUpdateTask: store.keystore.update
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleUpdatePassword: payload => dispatch(keystore.handlers.update.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(AccountUpdate));
