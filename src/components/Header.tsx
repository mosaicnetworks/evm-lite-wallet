import * as React from 'react';

import { NavLink as Link } from 'react-router-dom';
import { Container, Icon, Image, Input } from 'semantic-ui-react';

import * as MONET_LOGO from '../assets/monet_logo.png';

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
					<div className="logo12">
						<Link to="/">
							<Image src={MONET_LOGO} width={40} />
						</Link>
					</div>
					<div className="links">
						<li className="search">
							<Input placeholder="Search" />
						</li>
						<li>
							<Link activeClassName="is-active" to="/poa">
								<Icon
									size={'large'}
									color={'black'}
									name="connectdevelop"
								/>
							</Link>
						</li>
						<li>
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
						<li>
							<Link
								activeClassName="is-active"
								exact={true}
								to="/notifications"
							>
								<Icon
									size={'large'}
									color={'blue'}
									name="bell"
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
