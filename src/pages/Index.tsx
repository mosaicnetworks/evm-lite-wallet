import * as React from 'react';

import { connect } from 'react-redux';

import { Store } from '../redux';

interface StoreProps {
	currentDataDirectory?: undefined;
}

type LocalProps = StoreProps;

class Index extends React.Component<LocalProps, any> {
	public render() {
		return <React.Fragment />;
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapsDispatchToProps = (dispatch: any) => ({});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(Index);
