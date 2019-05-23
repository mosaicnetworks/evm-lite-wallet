import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { config, Transition } from 'react-spring/renderprops';
import { Input, Button } from 'semantic-ui-react';

import { AccountsCreateReducer } from '../redux/reducers/Accounts';
import { AccountsCreatePayLoad } from '../redux/actions/Accounts';
import { Store } from '../redux';

import AnimationRight from './AnimationRight';

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

class AccountUnlock extends React.Component<Props, State> {
	public state = {
		visible: false,
		fields: {
			password: '',
			verifyPassword: ''
		}
	};

	public render() {
		const { accountCreateTask } = this.props;
		const { visible } = this.state;

		return (
			<React.Fragment>
				<Transition
					items={visible}
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
									disabled={accountCreateTask.isLoading}
									loading={accountCreateTask.isLoading}
								/>
							</Open>
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
							<Close
								style={props}
								onClick={() =>
									this.setState({
										visible: !visible
									})
								}
							>
								<Button icon="times" color="red" />
							</Close>
						))
					}
				</Transition>
				{!visible && (
					<AnimationRight>
						<Open
							onClick={() =>
								this.setState({
									visible: true
								})
							}
						>
							<Button icon="lock" color="orange" />
						</Open>
					</AnimationRight>
				)}
				<Transition
					items={visible}
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
	accountCreateTask: store.accounts.create
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleCreateAccount: payload =>
		dispatch(redux.actions.accounts.create.handlers.init(payload))
});

export default connect<StoreProps, DispatchProps, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(AccountUnlock));
