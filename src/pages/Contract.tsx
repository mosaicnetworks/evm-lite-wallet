import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Card, Divider } from 'semantic-ui-react';

import { Store, ContractLoadReducer } from '../redux';

import ContractLoad from '../components/ContractLoad';
import ContractMethods from '../components/ContractMethods';

import './styles/Accounts.css';

interface State {
	loading: boolean;
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	contractLoadTask: ContractLoadReducer;
}

interface DispatchProps {
	empty?: null;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Contract extends React.Component<LocalProps, State> {
	public state = {
		loading: false
	};

	public render() {
		return (
			<React.Fragment>
				<div className={'page-left-right-padding'}>
					<Card fluid={true}>
						<Card.Content>
							<Card.Header>Contract Abstraction</Card.Header>
							<Card.Meta>
								Select from the options below.
							</Card.Meta>
							<Divider hidden={true} />
							<Card.Description>
								<ContractLoad />
							</Card.Description>
						</Card.Content>
					</Card>
					{this.props.contractLoadTask.response && (
						<Card fluid={true}>
							<Card.Content>
								<Card.Header>Contract</Card.Header>
								<Card.Meta>
									Loaded contract details below.
								</Card.Meta>
							</Card.Content>
							<Card.Content>
								{this.props.contractLoadTask.response ? (
									<ContractMethods
										contract={
											this.props.contractLoadTask
												.response!
										}
										contractABI={
											this.props.contractLoadTask
												.response!.options.interface
										}
									/>
								) : null}
							</Card.Content>
						</Card>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	contractLoadTask: store.contract.load
});

const mapsDispatchToProps = (): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Contract));
