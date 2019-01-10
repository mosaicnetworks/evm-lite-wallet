import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button, Divider, Form, Header, Label, Modal } from 'semantic-ui-react';

import { ConfigLoadReducer, KeystoreCreatePayLoad, KeystoreCreateReducer, Store } from '../../../redux';

import redux from '../../../redux.config';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	configLoadTask: ConfigLoadReducer;
	keystoreCreateTask: KeystoreCreateReducer;
}

interface DispatchProps {
	handleCreateAccount: (payload: KeystoreCreatePayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps

interface State {
	open: boolean;
	fields: {
		password: string;
		verifyPassword: string;
	};
	errors: {
		fieldError: string;
	}
}

class AccountCreate extends React.Component<LocalProps, State> {
	public state = {
		open: false,
		fields: {
			password: '',
			verifyPassword: ''
		},
		errors: {
			fieldError: ''
		}
	};

	public open = () => this.setState({ open: true });
	public close = () => this.setState({ open: false });

	public componentWillUpdate(nextProps: Readonly<LocalProps>, nextContext: any): void {
		if (!this.props.keystoreCreateTask.error && !!nextProps.keystoreCreateTask.error) {
			nextProps.alert.error(nextProps.keystoreCreateTask.error);
		}

		if (!this.props.keystoreCreateTask.response && !!nextProps.keystoreCreateTask.response) {
			nextProps.alert.success(`Account created: ${nextProps.keystoreCreateTask.response.address}`);
			this.close();
		}
	}

	public handleChangeVerifyPassword = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				password: e.target.value
			}
		});
	};

	public handleChangePassword = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				verifyPassword: e.target.value
			}
		});
	};

	public handleCreate = async () => {
		this.setState({
			errors: {
				fieldError: ''
			}
		});

		const { fields } = this.state;

		if (!fields.password || !fields.verifyPassword) {
			this.props.alert.error('Both fields must not be empty.');
			return;
		}
		if (fields.password !== fields.verifyPassword) {
			this.props.alert.error('Passwords do not match.');
			return;
		}
		if (this.props.configLoadTask.response) {
			this.props.handleCreateAccount({
				password: this.state.fields.password,
				keystore: this.props.configLoadTask.response.storage.keystore
			});
		}
	};

	public render() {
		const { configLoadTask } = this.props;

		return (
			<React.Fragment>
				<Modal open={this.state.open}
					   onClose={this.close}
					   trigger={
						   <Button content='Create' color={'green'} icon='plus'
								   onClick={this.open}
								   labelPosition='left'/>
					   }>
					<Modal.Header>Create an Account</Modal.Header>
					<Modal.Content>
						<Header as={'h4'}>
							Information
						</Header>
						Enter a password to encrypt your account. The created account will be placed in the keystore
						directory specified in the configuration tab. If you would like to create the account in a
						different
						directory, update the configuration for keystore. <br/><br/>
						<Label>
							Keystore
							<Label.Detail>
								{configLoadTask.response && configLoadTask.response.storage.keystore}
							</Label.Detail>
						</Label><br/><br/>
						<Divider/>
						<Modal.Description>
							<Form>
								<Form.Field>
									<label>Password: </label>
									<input onChange={this.handleChangePassword}/>
								</Form.Field>
								<Form.Field>
									<label>Verify Password: </label>
									<input onChange={this.handleChangeVerifyPassword}/>
								</Form.Field>
							</Form>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.close}>Close</Button>
						<Button onClick={this.handleCreate} color={'green'} type='submit'>Create</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	configLoadTask: store.config.load,
	keystoreCreateTask: store.keystore.create
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleCreateAccount: payload => dispatch(redux.actions.keystore.handlers.create.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(AccountCreate));
