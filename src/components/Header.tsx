import * as React from 'react';

import { NavLink as Link } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';

import MONET_LOGO from '../assets/monet_logo.png';

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
							<img src={MONET_LOGO} width={40} />
						</Link>
					</div>
					<div className="links">
						<li>
							<Link activeClassName="is-active" to="/poa">
								<Icon
									size={'large'}
									color={'black'}
									name="connectdevelop"
								/>
							</Link>
							<Link
								exact={true}
								activeClassName="is-active"
								to="/"
							>
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
