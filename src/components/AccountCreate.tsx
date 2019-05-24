import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { config, Transition } from 'react-spring/renderprops';
import { Input, Button } from 'semantic-ui-react';
import { V3JSONKeyStore, Static } from 'evm-lite-lib';

import { AccountsCreateReducer } from '../redux/reducers/Accounts';
import { AccountsCreatePayLoad } from '../redux/actions/Accounts';
import { Store } from '../redux';

import Animation from './animations/Animation';

import redux from '../redux.config';

const CreateAccountSlider = styled.div`
	position: fixed;
	bottom: 100px;
	right: 0;
	width: auto;
	color: white !important;
	border-top-left-radius: 7px;
	border-bottom-left-radius: 7px;

	&:hover {
		cursor: pointer;
	}

	& button {
		border-top-right-radius: 0px !important;
		border-bottom-right-radius: 0px !important;
		margin: 0 !important;
		margin-left: -2px !important;
	}
`;

const CreateAccountSliderClose = styled.div`
	position: fixed;
	bottom: 140px;
	right: 0;
	width: auto;
	color: white !important;
	border-top-left-radius: 7px;
	border-bottom-left-radius: 7px;

	& button {
		border-top-right-radius: 0px !important;
		border-bottom-right-radius: 0px !important;
		margin: 0 !important;
		margin-left: -2px !important;
	}

	&:hover {
		cursor: pointer;
	}
`;

const CreateAccountContent = styled.div`
	position: fixed;
	bottom: 100px;
	right: -341px;
	width: auto;
	padding: 20px;
	background: #fff !important;
	box-shadow: 0 4px 20px -6px #999 !important;

	&:hover {
		cursor: pointer;
	}

	& span {
		margin-bottom: 10px !important;
		display: block !important;
		font-size: 17px;
		font-weight: bold !important;
	}
`;
interface State {
	visible: boolean;
	fields: {
		password: string;
		verifyPassword: string;
	};
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountCreateTask: AccountsCreateReducer;
}

interface DispatchProps {
	handleCreateAccount: (payload: AccountsCreatePayLoad) => void;
}

type Props = StoreProps & AlertProps & DispatchProps;

class AccountCreate extends React.Component<Props, State> {
	public state = {
		visible: false,
		fields: {
			password: '',
			verifyPassword: ''
		}
	};

	public componentWillReceiveProps = (nextProps: Props) => {
		if (
			!this.props.accountCreateTask.response &&
			nextProps.accountCreateTask.response
		) {
			const account: V3JSONKeyStore =
				nextProps.accountCreateTask.response;

			this.props.alert.success(
				`Account created:  ${Static.cleanAddress(
					account.address.substring(0, 8)
				)}...`
			);
		}
	};

	public handleCreateAccount = () => {
		const { fields } = this.state;

		if (!fields.password || !fields.verifyPassword) {
			this.props.alert.error('Both fields must be filled in.');
			return;
		}

		if (fields.password !== fields.verifyPassword) {
			this.props.alert.error('Passwords do not match.');
			return;
		}

		this.setState({
			visible: false,
			fields: {
				password: '',
				verifyPassword: ''
			}
		});

		this.props.handleCreateAccount({
			password: fields.password
		});
	};

	public render() {
		const { accountCreateTask } = this.props;
		const { visible } = this.state;

		return (
			<React.Fragment>
				<Transition
					items={visible}
					from={{ right: '0px', display: 'none' }}
					enter={{ right: '340px', display: 'block' }}
					leave={{ right: '0px', display: 'none' }}
					config={config.stiff}
				>
					{show =>
						show &&
						(props => (
							<CreateAccountSlider
								style={props}
								onClick={this.handleCreateAccount}
							>
								<Button
									icon="check"
									color="green"
									disabled={accountCreateTask.isLoading}
									loading={accountCreateTask.isLoading}
								/>
							</CreateAccountSlider>
						))
					}
				</Transition>
				<Transition
					items={visible}
					from={{ opacity: 0, right: '0px' }}
					enter={{ opacity: 1, right: '340px' }}
					leave={{ opacity: 0, right: '0px' }}
					config={config.stiff}
				>
					{show =>
						show &&
						(props => (
							<CreateAccountSliderClose
								style={props}
								onClick={() =>
									this.setState({
										visible: !visible
									})
								}
							>
								<Button icon="times" color="red" />
							</CreateAccountSliderClose>
						))
					}
				</Transition>
				{!visible && (
					<Animation direction="right">
						<CreateAccountSlider
							onClick={() =>
								this.setState({
									visible: true
								})
							}
						>
							<Button icon="plus" color="green" />
						</CreateAccountSlider>
					</Animation>
				)}
				<Transition
					items={visible}
					from={{ right: '-340px' }}
					enter={{ right: '0px' }}
					leave={{ right: '-340px' }}
					config={config.stiff}
				>
					{show =>
						show &&
						(props => (
							<CreateAccountContent style={props}>
								<h4>Create An Account</h4>
								<Input
									placeholder="Set Password"
									type="password"
									onChange={(e, { value }) =>
										this.setState({
											fields: {
												...this.state.fields,
												password: value
											}
										})
									}
								/>
								<br />
								<Input
									placeholder="Verify Password"
									type="password"
									onChange={(e, { value }) =>
										this.setState({
											fields: {
												...this.state.fields,
												verifyPassword: value
											}
										})
									}
								/>
							</CreateAccountContent>
						))
					}
				</Transition>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accountCreateTask: store.accounts.create
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleCreateAccount: payload =>
		dispatch(redux.actions.accounts.create.handlers.init(payload))
});

export default connect<StoreProps, DispatchProps, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(AccountCreate));
