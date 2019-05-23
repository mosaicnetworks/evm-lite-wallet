import * as React from 'react';

import styled from 'styled-components';
import Highlight from 'react-highlight';

import { connect } from 'react-redux';
import { Segment, Icon, Image, Table, Grid } from 'semantic-ui-react';
import { Static } from 'evm-lite-lib';

import { Store } from '../redux';

import Misc from '../classes/Misc';

import * as TENOM from '../assets/logo.png';

const BoldCentered = styled.div`
	text-align: center !important;
	font-weight: bold !important;
`;

const TransactionDetails = styled.div`
	background: #fefefe !important;
	padding: 30px;
`;

const JSONViewer = styled.div``;

export interface SentTransaction {
	id: number;
	from: string;
	to: string;
	value: number;
	status: boolean;
	incoming: boolean;
}

interface StoreProps {
	currentDataDirectory?: undefined;
}

interface OwnProps {
	transaction: SentTransaction;
	style?: any;
}

interface State {
	visible: boolean;
}

type LocalProps = StoreProps & OwnProps;

class Transaction extends React.Component<LocalProps, State> {
	public state = {
		visible: false
	};

	public render() {
		const { transaction, style } = this.props;
		const { visible } = this.state;

		const icon = !visible ? 'chevron right' : 'chevron down';
		const Value = styled.span`
			color: ${transaction.incoming ? 'green' : 'red'};
		`;

		const Status = styled.span`
			color: ${transaction.status ? 'green' : 'red'};
		`;

		return (
			<React.Fragment>
				<Segment.Group
					key={transaction.id}
					style={style}
					horizontal={true}
				>
					<Segment>
						<BoldCentered>
							{transaction.incoming ? 'INCOMING' : 'OUTGOING'}
						</BoldCentered>
					</Segment>
					<Segment>{Static.cleanAddress(transaction.from)}</Segment>
					<Segment>
						<BoldCentered>
							<Icon name="long arrow alternate right" />
						</BoldCentered>
					</Segment>
					<Segment>{Static.cleanAddress(transaction.to)}</Segment>
					<Segment>
						<BoldCentered>
							<Image src={TENOM} width={20} />
						</BoldCentered>
					</Segment>
					<Segment>
						<Value>
							{transaction.incoming ? '+' : '-'}
							{Misc.integerWithCommas(transaction.value)}
						</Value>
					</Segment>
					<Segment>
						<Status>
							<BoldCentered>
								{transaction.status ? 'Success' : 'Failure'}
							</BoldCentered>
						</Status>
					</Segment>
					<Segment>
						<BoldCentered>
							<Icon
								onClick={() =>
									this.setState({
										visible: !visible
									})
								}
								style={{ cursor: 'pointer' }}
								name={icon}
								color="blue"
							/>
						</BoldCentered>
					</Segment>
				</Segment.Group>
				{visible && (
					<TransactionDetails>
						<Grid columns="equal">
							<Grid.Column>
								<Table basic={true} celled={true}>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												Key
											</Table.HeaderCell>
											<Table.HeaderCell>
												Value
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										<Table.Row>
											<Table.Cell>From</Table.Cell>
											<Table.Cell>
												{Static.cleanAddress(
													transaction.from
												)}
											</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>To</Table.Cell>
											<Table.Cell>
												{Static.cleanAddress(
													transaction.to
												)}
											</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>Value</Table.Cell>
											<Table.Cell>
												<Value>
													{transaction.value}
												</Value>
											</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>Status</Table.Cell>
											<Table.Cell>
												<Status>
													{transaction.status
														? 'Success'
														: 'Failure'}
												</Status>
											</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>Incoming</Table.Cell>
											<Table.Cell>
												<Value>
													{transaction.incoming
														? 'True'
														: 'False'}
												</Value>
											</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table>
							</Grid.Column>
							<Grid.Column>
								<JSONViewer>
									<Highlight className="javascript">
										{JSON.stringify(transaction, null, 4)}
									</Highlight>
								</JSONViewer>
							</Grid.Column>
						</Grid>
					</TransactionDetails>
				)}
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any) => ({});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(Transaction);
