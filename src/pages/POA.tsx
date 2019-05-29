import * as React from 'react';

import styled from 'styled-components';

import { Spring, config } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { Button, Grid } from 'semantic-ui-react';
// import { Static } from 'evm-lite-lib';

import { Store } from 'src/store';

import Heading from '../components/Heading';
import FloatingButton from '../components/FloatingButton';
import Banner from '../components/Banner';
import Nominee from '../components/Nominee';

import Misc from '../classes/Misc';

// const capitalize = (word: string) =>
// 	word
// 		.toString()
// 		.charAt(0)
// 		.toUpperCase() + word.slice(1);

const WhiteListHeader = styled.h3``;

const WhiteList = styled.div`
	border-bottom-left-radius: 5px !important;
	box-shadow: 0 4px 20px -6px #eee !important;
`;

const WhiteListEntry = styled.div`
	padding: 15px 20px;
	background: #fff;
`;

WhiteListEntry.Moniker = styled.div`
	font-weight: bold !important;
	font-size: 17px;
	margin-bottom: 3px;
`;
WhiteListEntry.Address = styled.div`
	word-wrap: break-word;
	color: #555;
`;

const NomineeList = styled.div``;

const Content = styled.div`
	padding: 20px;
`;

interface StoreProps {
	empty?: undefined;
}

interface DispatchProps {
	empty?: undefined;
}

interface State {
	empty?: undefined;
}

type LocalProps = StoreProps & DispatchProps;

class POA extends React.Component<LocalProps, State> {
	public state = {};

	public handleFetchWhiteList = () => {
		// this.props.handleFetchWhiteList();
	};

	public render() {
		// const { whiteListTask } = this.props;

		return (
			<React.Fragment>
				<Heading
					heading={'Proof of Authority'}
					subHeading="Manage existing and nominate new validators"
				/>
				<Banner color="purple">
					Proof-of-authority (PoA) is an algorithm used this
					blockchain that delivers comparatively fast transactions
					through a consensus mechanism based on identity as a stake.
				</Banner>
				<Content>
					<Grid columns="equal">
						<Grid.Column width={12}>
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
										<Nominee
											moniker="Danu"
											address="0x75ce23a141e4b863aaf2ebe06e1700165786b493"
										/>
									</NomineeList>
								)}
							</Spring>
						</Grid.Column>
						<Grid.Column>
							<WhiteListHeader>Whitelist</WhiteListHeader>
							<WhiteList>
								{/* {whiteListTask.response &&
									whiteListTask.response.map((entry, i) => {
										return (
											<WhiteListEntry
												horizontal={true}
												key={i}
											>
												<WhiteListEntry.Moniker>
													{capitalize(
														entry.moniker.toString()
													)}
												</WhiteListEntry.Moniker>
												<WhiteListEntry.Address>
													{Static.cleanAddress(
														entry.address
													)}
												</WhiteListEntry.Address>
											</WhiteListEntry>
										);
									})} */}
							</WhiteList>
						</Grid.Column>
					</Grid>
				</Content>
				<FloatingButton bottomOffset={57}>
					{/* <Button
						loading={whiteListTask.isLoading}
						disabled={whiteListTask.isLoading}
						onClick={this.handleFetchWhiteList}
						color="blue"
						icon="circle notch"
					/> */}
				</FloatingButton>
				<FloatingButton bottomOffset={100}>
					<Button color="green" icon="plus" />
				</FloatingButton>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(POA);
