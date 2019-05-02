import * as React from 'react';

import { connect } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import { InjectedAlertProp, withAlert } from 'react-alert';

import { Store, ConfigLoadReducer, ConfigLoadPayLoad } from '../redux';

import Accounts from '../pages/Accounts';
import POA from '../pages/POA';

import Account from '../components/Account';
import Wrapper from '../components/Wrapper';

import './styles/App.css';

import redux from '../redux.config';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	configLoadTask: ConfigLoadReducer;
}

interface DispatchProps {
	handleConfigLoad: (payload: ConfigLoadPayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;

class App extends React.Component<LocalProps, any> {
	public componentDidMount() {
		console.log('mounted');
		this.props.handleConfigLoad({
			path: '/Users/danu/.evmlc/config.toml'
		});
	}

	public render() {
		return (
			<HashRouter>
				<React.Fragment>
					<Wrapper>
						<div>
							<Route exact={true} path="/" component={Accounts} />
							<Route
								path="/account/:address"
								component={Account}
							/>
							<Route path="/poa" component={POA} />
						</div>
					</Wrapper>
				</React.Fragment>
			</HashRouter>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	configLoadTask: store.config.load
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleConfigLoad: payload =>
		dispatch(redux.actions.config.load.handlers.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(App));
