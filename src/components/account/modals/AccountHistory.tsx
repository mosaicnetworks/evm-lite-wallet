import * as React from 'react';

import { Label, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { BaseAccount, SentTX, Static } from 'evm-lite-lib';

import { Store } from '../../../redux';

export interface AccountsHistoryLocalProps {
	account: BaseAccount;
	txs: SentTX[];
}

class AccountHistory extends React.Component<AccountsHistoryLocalProps, any> {
	public render() {
		return (
			<React.Fragment>
				<Table celled={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>To</Table.HeaderCell>
							<Table.HeaderCell>Value</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{this.props.txs &&
							this.props.txs.map((tx: any) => {
								return (
									<Table.Row key={tx.txHash || tx.hash}>
										<Table.Cell>
											{Static.cleanAddress(
												tx.to
											).toLowerCase()}
										</Table.Cell>
										<Table.Cell>{tx.value}</Table.Cell>
										<Table.Cell>
											<Label color={'green'}>
												Successful
											</Label>
										</Table.Cell>
									</Table.Row>
								);
							})}
						{!this.props.txs.length && (
							<Table.Row>
								<Table.Cell width={3}>
									<span style={{ color: 'indianred' }}>
										No transaction history.
									</span>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
	mapStoreToProps,
	mapDispatchToProps
)(AccountHistory);
