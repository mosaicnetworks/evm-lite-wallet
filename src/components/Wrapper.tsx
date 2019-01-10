import * as React from 'react';

import { Container } from 'semantic-ui-react';

import Header from './Header';


class Wrapper extends React.Component<any, any> {
	public state = { width: 0, height: 0 };

	public updateWindowDimensions = () => {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	};

	public componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	public render() {
		return (
			<React.Fragment>
				<Header/>
				<Container fluid={true} text={false}>
					{this.props.children}
				</Container>
			</React.Fragment>
		);
	}
}

export default Wrapper;
