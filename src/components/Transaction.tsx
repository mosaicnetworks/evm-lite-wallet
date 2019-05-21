import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { Segment, Label } from 'semantic-ui-react';
import { Static } from 'evm-lite-lib';

import { Store } from '../redux';

const BoldCentered = styled.div`
	text-align: center !important;
	font-weight: bold !important;
`;

export interface SentTransaction {
	id: number;
	from: string;
	to: string;
	value: number;
	status: boolean;
}

interface StoreProps {
	currentDataDirectory?: undefined;
}

interface OwnProps {
	transaction: SentTransaction;
	style?: any;
}

type LocalProps = StoreProps & OwnProps;

class Transaction extends React.Component<LocalProps, any> {
	public render() {
		const { transaction, style } = this.props;

		return (
			<React.Fragment>
				<Segment.Group
					key={transaction.id}
					style={style}
					horizontal={true}
				>
					<Segment>
						<Label>From</Label>
						{Static.cleanAddress(transaction.from)}
					</Segment>
					<Segment>
						<Label>To</Label>
						{Static.cleanAddress(transaction.to)}
					</Segment>
					<Segment>
						<Label>Value</Label> {transaction.value}
					</Segment>
					<Segment tertiary={true} inverted={true} color="green">
						<BoldCentered>Success</BoldCentered>
					</Segment>
				</Segment.Group>
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
