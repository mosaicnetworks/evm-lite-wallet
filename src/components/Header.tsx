import * as React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Icon, Label } from 'semantic-ui-react';

import {
	ApplicationConnectivityCheckReducer,
	ApplicationDataDirectoryPayLoad,
	ApplicationDirectoryChangeReducer,
	KeystoreListReducer,
	Store
} from '../redux';

import redux from '../redux.config';
import Defaults from '../classes/Defaults';
// @ts-ignore
import logo from '../assets/logo.png';

import './styles/Header.css';

interface StoreProps {
	keystoreListTask: KeystoreListReducer;
	directorySetTask: ApplicationDirectoryChangeReducer;
	connectivityTask: ApplicationConnectivityCheckReducer;
}

interface DispatchProps {
	handleDataDirectoryInit: (
		directory: ApplicationDataDirectoryPayLoad
	) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps;

class Header extends React.Component<LocalProps, any> {
	public state = {};

	public handleReloadApp = () => {
		const directory = this.props.directorySetTask.payload;

		this.props.handleDataDirectoryInit(directory || Defaults.dataDirectory);
	};

	public render() {
		const { keystoreListTask } = this.props;

		return (
			<Container fluid={true}>
				<div className="header-main">
					<div className="logo">
						<Link to="/">
							<img src={logo} width={45} />
						</Link>
					</div>
					<div className="links">
						<li>
							<Link to="/">
								<Label>
									{(keystoreListTask.response &&
										keystoreListTask.response.length) ||
										'0'}
								</Label>
								<Icon
									size={'big'}
									color={'black'}
									name="list alternate outline"
								/>
							</Link>
						</li>
						{/* <li>
							<Link to="/contract">
								<Icon
									size={'big'}
									color={'black'}
									name="file alternate"
								/>
							</Link>
						</li> */}
						<li>
							<Link to="/configuration">
								<Icon size={'big'} color={'black'} name="cog" />
							</Link>
						</li>
						<li>
							<a>
								<Label
									horizontal={true}
									color={
										this.props.connectivityTask.response
											? 'green'
											: 'red'
									}
								>
									{this.props.connectivityTask.response
										? 'Connected'
										: 'Not Connected'}
								</Label>
							</a>
						</li>
					</div>
				</div>
			</Container>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	keystoreListTask: store.keystore.list,
	directorySetTask: store.app.directory,
	connectivityTask: store.app.connectivity
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleDataDirectoryInit: directory =>
		dispatch(redux.actions.application.directory.init(directory))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(Header);
