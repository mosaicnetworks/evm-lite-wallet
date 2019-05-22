import * as React from 'react';

import styled from 'styled-components';

import { Spring, config } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { Button, Grid, Card, Segment } from 'semantic-ui-react';
import { Static } from 'evm-lite-lib';

import { POAWhiteListReducer } from '../redux/reducers/POA';
import { Store } from '../redux';

import StatusBar from '../components/StatusBar';
import Heading from '../components/Heading';

import redux from '../redux.config';

import Misc from '../classes/Misc';

const capitalize = (word: string) =>
	word.charAt(0).toUpperCase() + word.slice(1);

const Divider = styled.hr`
	border: 0 !important;
	background: #eee !important;
	border-bottom: 1px solid #eee !important;
`;

const WhiteListHeader = styled.h3`
	padding-top: 20px;
	padding-left: 20px;
	height: 50px;
	background: #fff !important;
`;

const AlignLeft = styled.div`
	float: left !important;
`;

const AlignRight = styled.div`
	float: right !important;
	margin-right: 10px;
	margin-top: -10px;
`;

const WhiteList = styled.div`
	margin: auto !important;
	position: sticky !important;
	top: 70px !important;
	background: #fff !important;
	border-bottom-left-radius: 5px !important;
	box-shadow: 0 4px 20px -6px #eee !important;
`;

const NomineeList = styled.div`
	padding: 15px;
`;

const Nominee = styled.div`
	background: #fff !important;
	margin-bottom: 20px !important;
`;

Nominee.Moniker = styled.h3`
	margin-bottom: 0 !important;
	padding: 20px;
	padding-bottom: 0 !important;
`;
Nominee.Address = styled.div`
	color: #666 !important;
	padding: 20px;
	padding-top: 0 !important;
	border-bottom: 1px solid #eee;
`;
Nominee.Content = styled.div`
	margin-top: 10px;
	background: #fefefe;
	padding: 20px !important;
	padding-top: 10px !important;
`;

const BoldCentered = styled.div`
	text-align: center !important;
	font-weight: bold !important;
`;

interface StoreProps {
	whiteListTask: POAWhiteListReducer;
}

interface DispatchProps {
	handleFetchWhiteList: () => void;
}

interface State {
	empty?: undefined;
}

type LocalProps = StoreProps & DispatchProps;

class POA extends React.Component<LocalProps, State> {
	public state = {};

	public handleFetchWhiteList = () => {
		this.props.handleFetchWhiteList();
	};

	public render() {
		const { whiteListTask } = this.props;

		return (
			<React.Fragment>
				<Heading
					heading={'Proof of Authority'}
					subHeading="Manage existing and nominate new validators"
				/>
				<Grid columns="equal">
					<Grid.Column width={12}>
						<br />
						<Spring
							from={{
								marginRight: -Misc.MARGIN_CONSTANT,
								opacity: 0
							}}
							to={{
								marginRight: 0,
								opacity: 1
							}}
							config={config.wobbly}
						>
							{props => (
								<NomineeList style={props}>
									<h3>Nominee List</h3>
									<Segment.Group horizontal={true}>
										<Segment>
											<BoldCentered>Danu</BoldCentered>
										</Segment>
										<Segment>
											0x89accd6b63d6ee73550eca0cba16c2027c13fda6
										</Segment>
										<Segment
											style={{
												cursor: 'pointer'
											}}
											onClick={() =>
												console.log('Approve')
											}
											color="green"
											inverted={true}
										>
											<BoldCentered>Approve</BoldCentered>
										</Segment>
										<Segment
											style={{
												cursor: 'pointer'
											}}
											onClick={() =>
												console.log('Decline')
											}
											color="red"
											inverted={true}
										>
											<BoldCentered>Decline</BoldCentered>
										</Segment>
									</Segment.Group>
								</NomineeList>
							)}
						</Spring>
					</Grid.Column>
					<Grid.Column>
						<WhiteList>
							<WhiteListHeader>
								<AlignLeft>Whitelist</AlignLeft>
								<AlignRight>
									<Button
										loading={whiteListTask.isLoading}
										disabled={whiteListTask.isLoading}
										onClick={this.handleFetchWhiteList}
										color="blue"
										icon="circle notch"
									/>
								</AlignRight>
							</WhiteListHeader>
							<Divider />
							{whiteListTask.response &&
								whiteListTask.response.map((entry, i) => {
									return (
										<Card fluid={true} key={i}>
											<Card.Content>
												<Card.Header>
													{capitalize(
														entry.moniker.toString()
													)}
												</Card.Header>
												<Card.Meta>
													{Static.cleanAddress(
														entry.address
													)}
												</Card.Meta>
											</Card.Content>
										</Card>
									);
								})}
						</WhiteList>
					</Grid.Column>
				</Grid>
				<StatusBar>
					<Button color="green" icon="plus" />
				</StatusBar>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	whiteListTask: store.poa.whiteList
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleFetchWhiteList: () =>
		dispatch(redux.actions.poa.whiteList.handlers.init(undefined))
});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(POA);
