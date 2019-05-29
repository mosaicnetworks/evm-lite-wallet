import * as React from 'react';

import styled from 'styled-components';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { config, Spring } from 'react-spring/renderprops';
import { Header } from 'semantic-ui-react';

import Misc from '../classes/Misc';

export const Jumbo = styled.div`
	background: #fff !important;
	width: 100% !important;
	padding: 30px;
	border-bottom: 1px solid #eee !important;
	padding-left: 20px;
	height: 115px;
	margin-top: -5px !important;
`;

interface AlertProps {
	alert: InjectedAlertProp;
}

interface OwnProps {
	heading: string;
	subHeading: string;
}

type LocalProps = OwnProps & AlertProps;

class Heading extends React.Component<LocalProps, any> {
	public render() {
		const { heading, subHeading } = this.props;

		return (
			<Jumbo>
				<Spring
					from={{
						marginLeft: -Misc.MARGIN_CONSTANT,
						opacity: 0
					}}
					to={{
						marginLeft: 0,
						opacity: 1
					}}
					config={config.wobbly}
				>
					{props => (
						<Header style={props} as="h2" floated="left">
							{heading}
							<Header.Subheader>{subHeading}</Header.Subheader>
						</Header>
					)}
				</Spring>
			</Jumbo>
		);
	}
}

export default withAlert(Heading);
