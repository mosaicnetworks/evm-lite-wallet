import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { config, Transition } from 'react-spring/renderprops';
import { Input, Button } from 'semantic-ui-react';

import { AccountsUnlockReducer } from '../redux/reducers/Accounts';
import { AccountsUnlockPayLoad } from '../redux/actions/Accounts';
import { Store } from '../redux';

import Animation from './animations/Animation';

import redux from '../redux.config';

const Open = styled.div`
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

const Close = styled.div`
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

const Content = styled.div`
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
	show: boolean;
	fields: {
		password: string;
	};
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountUnlockTask: AccountsUnlockReducer;
}

interface DispatchProps {
	handleUnlockAccount: (payload: AccountsUnlockPayLoad) => void;
}

interface OwnProps {
	address: string;
}

type Props = StoreProps & AlertProps & DispatchProps & OwnProps;

class AccountUnlock extends React.Component<Props, State> {
	public state = {
		show: false,
		fields: {
			password: ''
		}
	};

	public handleUnlockAccount = () => {
		const { fields } = this.state;

		if (!fields.password) {
			this.props.alert.error('Password cannot be empty.');
		}

		this.setState({
			show: false,
			fields: {
				password: ''
			}
		});

		this.props.handleUnlockAccount({
			address: this.props.address,
			password: fields.password
		});
	};

	public render() {
		const { accountUnlockTask } = this.props;
		const { show } = this.state;

		return (
			<React.Fragment>
				<Transition
					items={show}
					from={{ right: '-40px' }}
					enter={{ right: '340px' }}
					leave={{ right: '-40px' }}
					config={config.stiff}
				>
					{show =>
						show &&
						(props => (
							<Open style={props}>
								<Button
									icon="check"
									color="green"
									onClick={this.handleUnlockAccount}
									disabled={accountUnlockTask.isLoading}
									loading={accountUnlockTask.isLoading}
								/>
							</Open>
						))
					}
				</Transition>
				<Transition
					items={show}
					from={{ opacity: 0, right: '0px' }}
					enter={{ opacity: 1, right: '340px' }}
					leave={{ opacity: 0, right: '0px' }}
					config={config.stiff}
				>
					{show =>
						show &&
						(props => (
							<Close
								style={props}
								onClick={() =>
									this.setState({
										show: !show
									})
								}
							>
								<Button icon="times" color="red" />
							</Close>
						))
					}
				</Transition>
				{!show && (
					<Animation direction="right">
						<Open
							onClick={() =>
								this.setState({
									show: true
								})
							}
						>
							<Button icon="lock" color="orange" />
						</Open>
					</Animation>
				)}
				<Transition
					items={show}
					from={{ right: '-341px' }}
					enter={{ right: '0px' }}
					leave={{ right: '-341px' }}
					config={config.stiff}
				>
					{show =>
						show &&
						(props => (
							<Content style={props}>
								<h4>Unlock account</h4>
								<Input
									placeholder="Password"
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
							</Content>
						))
					}
				</Transition>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accountUnlockTask: store.accounts.unlock
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleUnlockAccount: payload =>
		dispatch(redux.actions.accounts.unlock.handlers.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(AccountUnlock));
