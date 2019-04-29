import * as React from 'react';

import { Container } from 'semantic-ui-react';

import Header from './Header';

class Wrapper extends React.Component<any, any> {
	public render() {
		return (
			<React.Fragment>
				<Header />
				<Container fluid={true} text={false}>
					{this.props.children}
				</Container>
			</React.Fragment>
		);
	}
}

export default Wrapper;
