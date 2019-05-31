import * as React from 'react';

import styled from 'styled-components';

import { Transaction } from '.';

const RedText = styled.div`
	color: red;
	padding: 20px;
	padding-top: 0 !important;
`;

const List = styled.div`
	&.label {
		margin-right: 10px !important;
	}
`;

export interface SentTransaction {
	id: number;
	from: string;
	to: string;
	value: number;
	status: boolean;
	incoming: boolean;
}

interface OwnProps {
	transactions: any[];
	style?: any;
}

interface State {
	empty?: null;
}

type LocalProps = OwnProps;

class Transactions extends React.Component<LocalProps, State> {
	public render() {
		const { transactions } = this.props;

		return (
			<React.Fragment>
				<List>
					{(transactions.length !== 0 &&
						transactions.map((tx, i) => {
							const transaction = tx as SentTransaction;
							return (
								<Transaction
									key={transaction.id}
									transaction={transaction}
								/>
							);
						})) || <RedText>No transaction history.</RedText>}
				</List>
			</React.Fragment>
		);
	}
}

export default Transactions;
