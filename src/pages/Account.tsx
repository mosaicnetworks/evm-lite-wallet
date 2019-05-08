import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import {
	Header,
	Button,
	Statistic,
	Divider,
	Table,
	Label
} from 'semantic-ui-react';

import { BaseAccount, Static } from 'evm-lite-lib';

import { Store } from '../redux';

import LoadingButton from '../components/LoadingButton';
import StatusBar from '../components/StatusBar';

import './styles/Account.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	empty?: null;
}

interface DispatchProps {
	empty?: null;
}

interface OwnProps {
	account?: BaseAccount;
	match: any;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Account extends React.Component<LocalProps, any> {
	public fetchAccount = () => {
		// pass
	};

	public render() {
		return (
			<React.Fragment>
				<div className="page-padding">
					<Header as="h2" className={'address-heading'}>
						{Static.cleanAddress(this.props.match.params.address)}
						<Header.Subheader>
							Manage your account and transfer funds from here.
						</Header.Subheader>
					</Header>
					<br />
					<br />
					<div>
						<Statistic.Group widths="two" size={'small'}>
							<Statistic>
								<Statistic.Value>0</Statistic.Value>
								<Statistic.Label>Balance</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>0</Statistic.Value>
								<Statistic.Label>Nonce</Statistic.Label>
							</Statistic>
						</Statistic.Group>
					</div>
					<br />
					<Divider clearing={true} hidden={true} />
					<br />
					<div>
						<Table celled={true} basic="very">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>
										To / Amount
									</Table.HeaderCell>
									<Table.HeaderCell>Status</Table.HeaderCell>
									<Table.HeaderCell>Receipt</Table.HeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								<Table.Row>
									<Table.Cell>
										<Label
											className="amount_label"
											color="green"
										>
											200
										</Label>
										{Static.cleanAddress(
											this.props.match.params.address
										)}
									</Table.Cell>
									<Table.Cell>
										<Label color="green">Success</Label>
									</Table.Cell>
									<Table.Cell>None</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</div>
				</div>
				<StatusBar>
					<Button
						basic={false}
						color={'green'}
						content={'Transfer'}
					/>
					<Button
						basic={false}
						color={'yellow'}
						content={'Update Password'}
					/>
					<Button basic={false} icon={'file'} color={'orange'} />
					<LoadingButton
						onClickHandler={this.fetchAccount}
						isLoading={false}
					/>
				</StatusBar>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Account));
