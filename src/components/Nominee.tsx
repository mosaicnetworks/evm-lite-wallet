import * as React from 'react';

import styled from 'styled-components';

import { Segment, Icon, Label } from 'semantic-ui-react';

import Animation from './animations/Animation';

const Centered = styled.div`
	text-align: center !important;
	font-weight: bold !important;
`;

interface State {
	show: boolean;
}

interface Props {
	moniker: string;
	address: string;
}

class Nominee extends React.Component<Props, State> {
	public state = {
		show: false
	};

	public render() {
		const { moniker, address } = this.props;
		const { show } = this.state;

		const icon = !show ? 'chevron right' : 'chevron down';

		return (
			<React.Fragment>
				<Segment.Group horizontal={true}>
					<Segment>
						<Centered>{moniker}</Centered>
					</Segment>
					<Segment>{address}</Segment>
					<Segment
						style={{
							cursor: 'pointer'
						}}
						onClick={() => console.log('Approve')}
						color="green"
						tertiary={true}
						inverted={true}
					>
						<Centered>Approve</Centered>
					</Segment>
					<Segment
						style={{
							cursor: 'pointer'
						}}
						onClick={() => console.log('Decline')}
						color="red"
						inverted={true}
					>
						<Centered>Decline</Centered>
					</Segment>
					<Segment
						style={{
							cursor: 'pointer'
						}}
						onClick={() => this.setState({ show: !show })}
					>
						<Centered>
							<Icon color="blue" name={icon} />
						</Centered>
					</Segment>
				</Segment.Group>
				{show && (
					<Animation direction="right">
						<Segment.Group horizontal={true}>
							<Segment>
								<h4>Already Voted:</h4>
								<Label content="Danu" color="green" />
							</Segment>
						</Segment.Group>
					</Animation>
				)}
			</React.Fragment>
		);
	}
}

export default Nominee;
