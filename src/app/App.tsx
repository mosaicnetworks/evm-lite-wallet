import * as path from 'path';
import * as React from 'react';

import { connect } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import { InjectedAlertProp, withAlert } from 'react-alert';

import {
	Store,
	DataDirectorySetReducer,
	DataDirectorySetPayLoad
} from '../redux';

import ReduxSagaAlert from '../poa/alerts';

import Accounts from '../pages/Accounts';
import POA from '../pages/POA';
import Account from '../pages/Account';
import Configuration from '../pages/Configuration';

import Wrapper from '../components/Wrapper';
import redux from '../redux.config';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	setDataDirectoryTask: DataDirectorySetReducer;
}

interface DispatchProps {
	handleSetDataDirectory: (payload: DataDirectorySetPayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;

class App extends React.Component<LocalProps, any> {
	public componentWillUpdate(
		nextProps: Readonly<LocalProps>,
		nextState: Readonly<any>,
		nextContext: any
	): void {
		ReduxSagaAlert.wrap(nextProps.setDataDirectoryTask, (type, message) => {
			this.props.alert[type](message);
		});
	}
	public componentDidMount() {
		// @ts-ignore
		const defaultPath = path.join(window.require('os').homedir(), '.evmlc');

		this.props.handleSetDataDirectory(
			this.props.setDataDirectoryTask.response || defaultPath
		);
	}

	public render() {
		return (
			<HashRouter>
				<React.Fragment>
					<Wrapper>
						<Route exact={true} path="/" component={Accounts} />
						<Route
							name="account"
							exact={true}
							path="/account/:address/:balance/:nonce"
							component={Account}
						/>
						<Route path="/poa" component={POA} />
						<Route
							path="/configuration"
							component={Configuration}
						/>
					</Wrapper>
				</React.Fragment>
			</HashRouter>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	setDataDirectoryTask: store.dataDirectory.setDirectory
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleSetDataDirectory: payload =>
		dispatch(
			redux.actions.dataDirectory.setDirectory.handlers.init(payload)
		)
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(App));
