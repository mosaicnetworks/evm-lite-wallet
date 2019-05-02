import * as React from 'react';

import { connect } from 'react-redux';
import { Button, Card, Header, Icon } from 'semantic-ui-react';

import { Store } from '../redux';
import { NomineeElection, Validator } from '../poa/State';

import StatusBar from '../components/StatusBar';

import './styles/POA.css';

interface StoreProps {
	empty?: undefined;
}

interface State {
	validators: Validator[];
	elections: NomineeElection[];
}

type LocalProps = StoreProps;

class POA extends React.Component<LocalProps, State> {
	public state = {
		validators: [
			{
				moniker: 'Giacomo',
				address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
			},
			{
				moniker: 'Kevin',
				address: '0xC40352A3840f05233DF3cEd4740897973e321404'
			},
			{
				moniker: 'Jon',
				address: '0x1EE60b5e39Cd9652Fe0eDb11ceC62CaF5FaBD6C9'
			}
		],
		elections: [
			{
				moniker: 'Danu',
				address: '0x873375ac5181D80404A330c97f08704273b3b865',
				nominator: {
					moniker: 'Giacomo',
					address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
				},
				votes: []
			}
		]
	};

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
					<Header as="h4" content="Awaiting Your Decision" />
					<Card.Group>
						{this.state.elections.map(election => {
							return (
								<Card key={election.address}>
									<Card.Content>
										<Card.Header>
											{election.moniker}
										</Card.Header>
										<Card.Meta>
											{election.address.substring(0, 30)}
											...
										</Card.Meta>
										<Card.Description>
											{election.moniker} was nominated by{' '}
											<strong>
												{election.nominator.moniker}
											</strong>
										</Card.Description>
									</Card.Content>
									<Card.Content extra={true}>
										<div className="ui two buttons">
											<Button basic={true} color="green">
												Approve
											</Button>
											<Button basic={true} color="red">
												Decline
											</Button>
										</div>
									</Card.Content>
								</Card>
							);
						})}
					</Card.Group>
				</div>
				<br />
				<br />
				<div>
					<Header as="h4" content="On-Going Elections" />
					<Card.Group>
						<Card>
							<Card.Content header="About Amy" />
							<Card.Content
								description={
									'Amy is a violinist with 2 years experience in the wedding industry.'
								}
							/>
							<Card.Content extra={true}>
								<Icon name="circle" color={'green'} />4
							</Card.Content>
						</Card>
					</Card.Group>
				</div>
				<br />
				<br />
				<div>
					<Header as="h4" content="Existing Validators" />
					<Card.Group>
						{this.state.validators.map(validator => {
							return (
								<Card key={validator.address}>
									<Card.Content>
										<Card.Header>
											{validator.moniker}
										</Card.Header>
										<Card.Meta>
											{validator.address.substring(0, 30)}
											...
										</Card.Meta>
									</Card.Content>
								</Card>
							);
						})}
					</Card.Group>
				</div>
				<StatusBar>
					<Button color="blue" basic={false}>
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
