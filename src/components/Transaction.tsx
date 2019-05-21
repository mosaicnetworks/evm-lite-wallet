import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { Segment, Icon, Image } from 'semantic-ui-react';
import { Static } from 'evm-lite-lib';

import { Store } from '../redux';

import * as TENOM from '../assets/logo_trans.png';

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

		return (
			<React.Fragment>
				<Segment.Group
					key={transaction.id}
					style={style}
					horizontal={true}
				>
					<Segment>
						<BoldCentered>From</BoldCentered>
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
					<Segment>{transaction.value}</Segment>
					<Segment tertiary={true} inverted={true} color="green">
						<BoldCentered>Success</BoldCentered>
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
								name="info circle"
								color="blue"
								size="big"
							/>
						</BoldCentered>
					</Segment>
				</Segment.Group>
				{visible && (
					<Segment.Group
						key={transaction.id}
						style={style}
						horizontal={true}
					>
						<Segment>Receipt here.</Segment>
					</Segment.Group>
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
