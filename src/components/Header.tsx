import * as React from 'react';

import { Link } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';

import logo from '../assets/logo.png';

import './styles/Header.css';

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps;

class Header extends React.Component<LocalProps, any> {
	public state = {};

	public render() {
		return (
			<Container fluid={true}>
				<div className="header-main">
					<div className="logo">
						<Link to="/">
							<img src={logo} width={40} />
						</Link>
					</div>
					<div className="links">
						<li>
							<Link to="/">
								<Icon
									size={'large'}
									color={'black'}
									name="bars"
								/>
							</Link>
						</li>
					</div>
				</div>
			</Container>
		);
	}
}

export default Header;
