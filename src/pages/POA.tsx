import * as React from 'react';

import { connect } from 'react-redux';
import { Button, Table, Header } from 'semantic-ui-react';

import { Store } from '../redux';

import StatusBar from '../components/StatusBar';

import './styles/POA.css';

interface StoreProps {
	empty?: undefined;
}

type LocalProps = StoreProps;

class POA extends React.Component<LocalProps, any> {
	public renderElections = () => {
		// pass
	};

	public render() {
		return (
			<div className="content">
				<Header
					icon="connectdevelop"
					as="h2"
					content="Proof of Authority"
					subheader="Manage existing and nominate new validators"
				/>
				<br />
				<br />
				<div>
					<Header as="h4" content="Awaiting Election Results" />
					<Table celled={true}>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Moniker</Table.HeaderCell>
								<Table.HeaderCell>Address</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							<Table.Row disabled={true}>
								<Table.Cell>Jamie</Table.Cell>
								<Table.Cell>Approved</Table.Cell>
								<Table.Cell>Requires call</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>John</Table.Cell>
								<Table.Cell>Selected</Table.Cell>
								<Table.Cell>None</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Jamie</Table.Cell>
								<Table.Cell>Approved</Table.Cell>
								<Table.Cell>Requires call</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell disabled={true}>Jill</Table.Cell>
								<Table.Cell>Approved</Table.Cell>
								<Table.Cell>None</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
				<br />
				<br />
				<StatusBar>
					<Button color="green" basic={false}>
						Nominate
					</Button>
				</StatusBar>
			</div>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any) => ({});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(POA);
