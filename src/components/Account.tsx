import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import {
	Header,
	Button,
	Statistic,
	Divider,
	Table,
	Icon
} from 'semantic-ui-react';

import { BaseAccount } from 'evm-lite-lib';

import { Store } from '../redux';

// import LoadingButton from '../components/LoadingButton';

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
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Accounts extends React.Component<LocalProps, any> {
	public fetchAccount = () => {
		// pass
	};

	public render() {
		return (
			<React.Fragment>
				<div className="action-buttons">
					<Button basic={true} color={'green'} content={'Transfer'} />
					<Button
						basic={true}
						color={'yellow'}
						content={'Update Password'}
					/>
					<Button basic={true} icon={'file'} color={'grey'} />
					{/* <LoadingButton */}
					{/* isLoading={false} */}
					{/* onClickHandler={this.fetchAccount} */}
					{/* right={true} */}
					{/* /> */}
				</div>
				<div className="page-padding">
					<Header as="h2" className={'address-heading'}>
						0x
						{/* {this.props.match.params.address.toUpperCase()} */}
						<Header.Subheader>
							Manage your account and transfer funds from here.
						</Header.Subheader>
					</Header>
					<br />
					<Divider clearing={true} />
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
					<Divider clearing={true} />
					<br />
					<div>
						<Table celled={true} basic="very">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Name</Table.HeaderCell>
									<Table.HeaderCell>Status</Table.HeaderCell>
									<Table.HeaderCell>Notes</Table.HeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								<Table.Row>
									<Table.Cell>No Name Specified</Table.Cell>
									<Table.Cell>Unknown</Table.Cell>
									<Table.Cell>None</Table.Cell>
								</Table.Row>
								<Table.Row warning={true}>
									<Table.Cell>Jimmy</Table.Cell>
									<Table.Cell>
										<Icon name="attention" />
										Requires Action
									</Table.Cell>
									<Table.Cell>None</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Jamie</Table.Cell>
									<Table.Cell>Unknown</Table.Cell>
									<Table.Cell warning={true}>
										<Icon name="attention" />
										Hostile
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Jill</Table.Cell>
									<Table.Cell>Unknown</Table.Cell>
									<Table.Cell>None</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
