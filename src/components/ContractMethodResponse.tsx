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

	public renderTableHeader = (headings: string[]) => {
		console.log('Heading', headings);
		return (
			<Table.Header>
				<Table.Row>
					{headings.map(heading => {
						return (
							<Table.HeaderCell key={heading}>
								{heading}
							</Table.HeaderCell>
						);
					})}
				</Table.Row>
			</Table.Header>
		);
	};

	public renderReceipt = (receipt: TXReceipt) => {
		return Object.keys(receipt).map(key => {
			return <Table.Cell key={key}>{receipt[key].toString()}</Table.Cell>;
		});
	};

	public renderResponse = (response: any[]) => {
		return response.map(item => {
			return <Table.Cell key={item}>{item.toString()}</Table.Cell>;
		});
	};

	public render() {
		console.log('REDNER RESPONSE PROPS', this.props);
		return (
			<React.Fragment>
				<Table celled={true}>
					{this.props.outputs.length
						? this.renderTableHeader(
								this.props.outputs.map(output => {
									return output.name;
								})
						  )
						: this.renderTableHeader(
								Object.keys(this.props.response)
						  )}
					<Table.Body>
						<Table.Row>
							{this.props.outputs.length
								? this.renderResponse(this.props
										.response as any[])
								: this.renderReceipt(this.props
										.response as TXReceipt)}
						</Table.Row>
					</Table.Body>
				</Table>
			</React.Fragment>
		);
	}
}

export default withAlert(ContractMethodResponse);
