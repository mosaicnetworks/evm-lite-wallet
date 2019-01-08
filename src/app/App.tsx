import * as React from 'react';

import { connect } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import { InjectedAlertProp, withAlert } from 'react-alert';

import { Store } from '../redux';
import { ApplicationDirectoryChangeReducer } from '../redux/reducers/Application';

import Accounts from '../pages/Accounts';
import Index from '../pages/Index';
import Configuration from '../pages/Configuration';
import Wrapper from '../components/Wrapper';
import Application from '../redux/actions/Application';
import Defaults from '../classes/Defaults';

import './styles/App.css';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	directorySetTask: ApplicationDirectoryChangeReducer;
	connectivityError: string | null;
	connectivityResponse: string | null;
}

interface DispatchProps {
	handleDataDirectoryInit: (directory: string) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;


const application = new Application();

class App extends React.Component<LocalProps, any> {

	public componentWillUpdate(nextProps: Readonly<LocalProps>, nextState: Readonly<any>, nextContext: any): void {
		if (this.props.connectivityError === null && nextProps.connectivityError !== this.props.connectivityError) {
			nextProps.alert.error('A connection to a node could not be established.');
		}

		if (this.props.connectivityResponse === null &&
			nextProps.connectivityResponse !== this.props.connectivityResponse) {
			nextProps.alert.success('Connection to node has been established.');
		}

		if (this.props.directorySetTask.payload === null &&
			nextProps.directorySetTask.error !== this.props.directorySetTask.error) {
			nextProps.alert.error('There was a problem setting the data directory.');
		}
	}

	public componentDidMount = () => {
		const directory = this.props.directorySetTask.payload;
		this.props.handleDataDirectoryInit(directory || Defaults.dataDirectory);
	};

	public render() {
		return (
			<HashRouter>
				<React.Fragment>
					<Wrapper>
						<Route exact={true} path="/" component={Index}/>
						<Route path="/accounts" component={Accounts}/>
						<Route path="/configuration" component={Configuration}/>
					</Wrapper>
				</React.Fragment>
			</HashRouter>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	directorySetTask: store.app.directory,
	connectivityError: store.app.connectivity.error,
	connectivityResponse: store.app.connectivity.response
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleDataDirectoryInit: directory => dispatch(application.handlers.directory.init(directory))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(App));
