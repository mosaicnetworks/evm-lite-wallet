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
