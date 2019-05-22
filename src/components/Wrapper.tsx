import * as React from 'react';

import { Container } from 'semantic-ui-react';

import Header from './Header';

class Wrapper extends React.Component<any, any> {
	public render() {
		console.log(React.Children.toArray(this.props.children)[0]);
		return (
			<React.Fragment>
				<Header />
				<Container fluid={true}>{this.props.children}</Container>
			</React.Fragment>
		);
	}
}

export default Wrapper;
