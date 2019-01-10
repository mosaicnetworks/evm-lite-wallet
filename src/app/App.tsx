import * as React from 'react';

import { connect } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import {
	ApplicationConnectivityCheckReducer,
	ApplicationDataDirectoryPayLoad,
	ApplicationDirectoryChangeReducer,
	Store
} from '../redux';

import redux from '../redux.config';
import Accounts from '../pages/Accounts';
import Configuration from '../pages/Configuration';
import Wrapper from '../components/Wrapper';
import Defaults from '../classes/Defaults';

import './styles/App.css';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	directorySetTask: ApplicationDirectoryChangeReducer;
	connectivityTask: ApplicationConnectivityCheckReducer;
}

interface DispatchProps {
	handleDataDirectoryChange: (directory: ApplicationDataDirectoryPayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;


class App extends React.Component<LocalProps, any> {

	public componentWillUpdate(nextProps: Readonly<LocalProps>, nextState: Readonly<any>, nextContext: any): void {
		if (!this.props.connectivityTask.error &&
			nextProps.connectivityTask.error !== this.props.connectivityTask.error) {
			nextProps.alert.error('A connection to a node could not be established.');
		}

		if (!this.props.connectivityTask.response &&
			nextProps.connectivityTask.response !== this.props.connectivityTask.response) {
			nextProps.alert.success('Connection to node has been established.');
		}

		if (!this.props.directorySetTask.payload &&
			nextProps.directorySetTask.error !== this.props.directorySetTask.error) {
			nextProps.alert.error('There was a problem setting the data directory.');
		}
	}

	public componentDidMount = () => {
		this.props.handleDataDirectoryChange(this.props.directorySetTask.payload || Defaults.dataDirectory);
	};

	public render() {
		return (
			<HashRouter>
				<React.Fragment>
					<Wrapper>
						<TransitionGroup>
							<CSSTransition in={true} appear={true} timeout={1000} classNames="slide1">
								<div>
									<Route exact={true} path="/" component={Accounts}/>
									<Route path="/configuration" component={Configuration}/>
								</div>
							</CSSTransition>
						</TransitionGroup>
					</Wrapper>
				</React.Fragment>
			</HashRouter>
		);
	}

}

const mapStoreToProps = (store: Store): StoreProps => ({
	directorySetTask: store.app.directory,
	connectivityTask: store.app.connectivity
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleDataDirectoryChange: directory => dispatch(redux.actions.application.directory.init(directory))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(App));
