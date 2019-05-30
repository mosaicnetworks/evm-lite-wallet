import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';

import { Store } from 'src/store';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface DispatchProps {
	empty?: null;
}

interface StoreProps {
	empty?: null;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = StoreProps & DispatchProps & OwnProps & AlertProps;

class Template extends React.Component<LocalProps, any> {
	public render() {
		return <React.Fragment />;
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Template));
