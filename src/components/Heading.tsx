import * as React from 'react';

import { Spring, config } from 'react-spring/renderprops';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Header } from 'semantic-ui-react';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface OwnProps {
	any: any;
}

type LocalProps = OwnProps & AlertProps;

class Heading extends React.Component<LocalProps, any> {
	public render() {
		return (
			<div className="jumbo">
				<Spring
					from={{
						marginLeft: -50,
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
							Heading
							<Header.Subheader>SubHeading</Header.Subheader>
						</Header>
					)}
				</Spring>
			</div>
		);
	}
}

export default withAlert(Heading);
