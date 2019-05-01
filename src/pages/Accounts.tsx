import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';

import {
	AccountsFetchAllPayLoad,
	AccountsFetchAllReducer,
	Store,
	ConfigLoadReducer
} from '../redux';

import redux from '../redux.config';

import LoadingButton from '../components/LoadingButton';
import StatusBar from '../components/StatusBar';

import './styles/Accounts.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accountsFetchAllTask: AccountsFetchAllReducer;
	configLoadTask: ConfigLoadReducer;
}

interface DispatchProps {
	handleFetchAllAccounts: (payload: AccountsFetchAllPayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Accounts extends React.Component<LocalProps, any> {
	public handleFetchAllAccounts = () => {
		if (this.props.configLoadTask.response) {
			this.props.handleFetchAllAccounts({
				keystoreDirectory: this.props.configLoadTask.response.storage
					.keystore
			});
		} else {
			this.props.alert.info(
				'Looks like there was a problem reading the config file.'
			);
		}
	};

	public render() {
		return (
			<React.Fragment>
				<StatusBar>
					<LoadingButton
						isLoading={this.props.accountsFetchAllTask.isLoading}
						onClickHandler={this.handleFetchAllAccounts}
						right={true}
						content={'Refresh accounts'}
					/>
				</StatusBar>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accountsFetchAllTask: store.accounts.fetchAll,
	configLoadTask: store.config.load
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleFetchAllAccounts: payload =>
		dispatch(redux.actions.accounts.fetchAll.handlers.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
