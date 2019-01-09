import * as React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Icon, Label } from 'semantic-ui-react';

import { Store } from '../redux';
import { KeystoreListReducer } from '../redux/reducers/Keystore';
import { ApplicationConnectivityCheckReducer, ApplicationDirectoryChangeReducer } from '../redux/reducers/Application';
import Application from '../redux/actions/Application';
import Defaults from '../classes/Defaults';

import './styles/Header.css';


interface StoreProps {
	keystoreListTask: KeystoreListReducer;
	directorySetTask: ApplicationDirectoryChangeReducer;
	connectivityTask: ApplicationConnectivityCheckReducer;
}

interface DispatchProps {
	handleDataDirectoryInit: (directory: string) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps;

const application = new Application();

class Header extends React.Component<LocalProps, any> {
	public state = { width: 0, height: 0 };

	public handleReloadApp = () => {
		const directory = this.props.directorySetTask.payload;

		this.props.handleDataDirectoryInit(directory || Defaults.dataDirectory);
	};

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
		const { keystoreListTask } = this.props;

		return (
			<div className="header-main">
				<Container fluid={this.state.width < 1200} style={{ paddingLeft: '20px !important' }}>
					<div className="logo">
						<Link to="/">
							<Icon fitted={false} color="orange" size={'large'} name="google wallet"/>
						</Link>
					</div>
					<div className="links">
						<li>
							<Link to="/accounts">
								<Label>
									{keystoreListTask.response && keystoreListTask.response.length || '0'}
								</Label>
								<Icon size={'big'} color={'black'} name="list alternate outline"/>
							</Link>
						</li>
						<li>
							<Link to="/configuration">
								<Icon size={'big'} color={'black'} name="cog"/>
							</Link>
						</li>
						<li>
							<a>
								<Label horizontal={true}
									   color={this.props.connectivityTask.response ? 'green' : 'red'}>
									{this.props.connectivityTask.response ? 'Online' : 'Offline'}
								</Label>
							</a>
						</li>
					</div>
				</Container>
			</div>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	keystoreListTask: store.keystore.list,
	directorySetTask: store.app.directory,
	connectivityTask: store.app.connectivity
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleDataDirectoryInit: directory => dispatch(application.handlers.directory.init(directory))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(Header);
