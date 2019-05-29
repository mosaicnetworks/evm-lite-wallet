import * as React from 'react';

import { Store } from 'src/store';
import { connect } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { ConfigSchema } from 'evm-lite-lib';

import { load } from '../modules/configuration';
import { initialize } from '../modules/application';

import Accounts from '../pages/Accounts';
import POA from '../pages/POA';
import Account from '../pages/Account';
import Configuration from '../pages/Configuration';

import Wrapper from '../components/Wrapper';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	empty?: null;
}

interface DispatchProps {
	loadConfig: () => Promise<ConfigSchema>;
	initializeApp: () => Promise<void>;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;

class App extends React.Component<LocalProps, any> {
	public componentDidMount() {
		this.props.initializeApp();
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
							path="/account/:address"
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

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	loadConfig: () => dispatch(load()),
	initializeApp: () => dispatch(initialize())
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(App));
