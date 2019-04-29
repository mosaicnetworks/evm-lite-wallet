import * as React from 'react';

import { connect } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import { InjectedAlertProp, withAlert } from 'react-alert';

import { Store } from '../redux';

import Index from '../pages/Index';
import Wrapper from '../components/Wrapper';

import './styles/App.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	empty?: null;
}

interface DispatchProps {
	empty?: null;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;

class App extends React.Component<LocalProps, any> {
	public render() {
		return (
			<HashRouter>
				<React.Fragment>
					<Wrapper>
						<div>
							<Route exact={true} path="/" component={Index} />
						</div>
					</Wrapper>
				</React.Fragment>
			</HashRouter>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(App));
