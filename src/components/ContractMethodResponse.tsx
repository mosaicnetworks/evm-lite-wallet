import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { TXReceipt } from 'evm-lite-lib';
import { Table } from 'semantic-ui-react';

interface State {
	empty?: number;
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface OwnProps {
	response: any[] | TXReceipt;
	outputs: any[];
}

type LocalProps = OwnProps & AlertProps;

class ContractMethodResponse extends React.Component<LocalProps, State> {
	public state = {};

	public renderReceipt = () => {
		// pass
	};

	public renderResponse = () => {
		// pass
	};

	public render() {
		return (
			<React.Fragment>
				<Table celled={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Notes</Table.HeaderCell>
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
			</React.Fragment>
		);
	}
}

export default withAlert(ContractMethodResponse);
