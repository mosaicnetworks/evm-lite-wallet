import * as React from 'react';

import styled from 'styled-components';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { config, Transition } from 'react-spring/renderprops';
import { Button, Input } from 'semantic-ui-react';

import { Store } from 'src/store';
import { AccountsState, unlock } from '../modules/accounts';

import Animation from './animations/Animation';

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
	width: 340px !important;
	background: #fff !important;
	box-shadow: 0 4px 20px -6px #999 !important;

	& h4 {
		background: rgba(0, 0, 0, 0.04);
		padding: 10px;
		letter-spacing: 0.5px;
		margin: 0 !important;
	}

	& div {
		padding: 5px 10px;
		padding-top: 0px;
	}

	& div.help {
		background: rgba(0, 0, 0, 0.02);
		font-size: 13px;
		padding: 4px 10px;
		color: #888;
		margin-bottom: 14px;
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
	accounts: AccountsState;
}

interface DispatchProps {
	unlock: (address: string, password: string) => Promise<Account | undefined>;
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
			return;
		}

		this.setState({
			show: false,
			fields: {
				password: ''
			}
		});

		this.props.unlock(this.props.address, fields.password);
	};

	public render() {
		const { accounts } = this.props;
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
									disabled={accounts.loading.unlock}
									loading={accounts.loading.unlock}
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
					from={{ right: '-340px' }}
					enter={{ right: '0px' }}
					leave={{ right: '-340px' }}
					config={config.stiff}
				>
					{show =>
						show &&
						(props => (
							<Content style={props}>
								<h4>Unlock account</h4>
								<div className="help">
									Unlocked accounts can be used to sign
									transactions without a password.
								</div>
								<div>
									<Input
										placeholder="Password"
										type="password"
										onChange={(_, { value }) =>
											this.setState({
												fields: {
													...this.state.fields,
													password: value
												}
											})
										}
									/>
								</div>
							</Content>
						))
					}
				</Transition>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accounts: store.accounts
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	unlock: (address, password) => dispatch(unlock(address, password))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<Props>(AccountUnlock));
