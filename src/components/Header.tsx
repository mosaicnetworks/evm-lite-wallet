import * as React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Icon, Label } from 'semantic-ui-react';

import { Store } from '../redux';
import { KeystoreListType } from '../redux/reducers/Keystore';
import { ApplicationDirectoryChangeType } from '../redux/reducers/Application';

import DataDirectoryButton from './modals/DataDirectoryButton';
import Application from '../redux/actions/Application';
import Defaults from '../classes/Defaults';

import './styles/Header.css';


interface StoreProps {
	keystoreListTask: KeystoreListType;
	directorySetTask: ApplicationDirectoryChangeType;
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

	public handleReloadApp = () => {
		const directory = this.props.directorySetTask.payload;

		this.props.handleDataDirectoryInit(directory || Defaults.dataDirectory);
	};

	public render() {
		const { keystoreListTask } = this.props;

		return (
			<div className="header-main">
				<Container>
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
							<a><DataDirectoryButton color={'teal'}/></a>
						</li>
						<li>
							<a>
								<Label horizontal={true} color={'green'}>
									Online
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
	directorySetTask: store.app.directory
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleDataDirectoryInit: directory => dispatch(application.handlers.directory.init(directory))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(Header);
