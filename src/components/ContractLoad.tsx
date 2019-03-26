import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Contract } from 'evm-lite-lib';
import {
	Button,
	Divider,
	Form,
	Header,
	Input,
	Modal,
	TextArea
} from 'semantic-ui-react';

import {
	Store,
	ConfigLoadReducer,
	ContractLoadReducer,
	ContractLoadPayload
} from '../redux';

import redux from '../redux.config';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	configLoadTask: ConfigLoadReducer;
	contractLoadTask: ContractLoadReducer;
}

interface DispatchProps {
	handleContractLoad: (payload: ContractLoadPayload) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;

interface State {
	contract: Contract<any> | null;
	open: boolean;
	fields: {
		address: string;
		abi: string;
	};
}

class AccountCreate extends React.Component<LocalProps, State> {
	public state = {
		contract: null,
		open: false,
		fields: {
			abi:
				'[{"constant":false,"inputs":[{"name":"pubKey"' +
				',"type":"string"},{"name":"rating","type":"uint256"}],"name"' +
				':"addKey","outputs":[],"payable":false,"stateMutability":' +
				'"nonpayable","type":"function"},{"constant":true,"inputs":' +
				'[{"name":"pubKey","type":"string"}],"name":"getKey","outputs"' +
				':[{"name":"key","type":"string"},{"name":"rating","type"' +
				':"uint256"}],"payable":false,"stateMutability":"view","type"' +
				':"function"},{"inputs":[],"payable":false,"stateMutability' +
				'":"nonpayable","type":"constructor"}]',
			address: '0x6494966e0bf2460510d41f98dddf80b1f2bc3514'
		}
	};

	public open = () => this.setState({ open: true });
	public close = () => this.setState({ open: false });

	public componentWillUpdate(
		nextProps: Readonly<LocalProps>,
		nextContext: any
	): void {
		if (
			!this.props.contractLoadTask.error &&
			!!nextProps.contractLoadTask.error
		) {
			nextProps.alert.error(nextProps.contractLoadTask.error);
		}

		if (
			!this.props.contractLoadTask.response &&
			!!nextProps.contractLoadTask.response
		) {
			nextProps.alert.success(`Contract loaded.`);
			this.close();
		}
	}
	public loadContract = async (e: any) => {
		this.props.handleContractLoad({
			address: this.state.fields.address,
			abi: JSON.parse(this.state.fields.abi)
		});
	};

	public handleAddressChange = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				address: e.target.value
			}
		});
	};

	public handleABIChange = (e: any) => {
		this.setState({
			fields: {
				...this.state.fields,
				abi: e.target.value
			}
		});
	};

	public render() {
		return (
			<React.Fragment>
				<Modal
					open={this.state.open}
					onClose={this.close}
					trigger={
						<Button
							content="Load"
							color={'blue'}
							icon={'plus'}
							onClick={this.open}
							labelPosition="left"
						/>
					}
				>
					<Modal.Header>Load Contract</Modal.Header>
					<Modal.Content>
						<Header as={'h4'}>Information</Header>
						Enter the deployed contract address and ABI below.
						<br />
						<br />
						<Divider />
						<Modal.Description>
							<Form>
								<Form.Field>
									<label>Contract Address</label>
									<Input
										onChange={this.handleAddressChange}
										defaultValue={this.state.fields.address}
									/>
								</Form.Field>
								<Form.Field>
									<label>Contract ABI</label>
									<TextArea
										defaultValue={this.state.fields.abi}
										autoHeight={true}
										onChange={this.handleABIChange}
									/>
								</Form.Field>
							</Form>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.close}>Close</Button>
						<Button
							loading={this.props.contractLoadTask.isLoading}
							onClick={this.loadContract}
							color={'blue'}
							type="submit"
						>
							Load
						</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	configLoadTask: store.config.load,
	contractLoadTask: store.contract.load
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleContractLoad: payload =>
		dispatch(redux.actions.contract.load.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(AccountCreate));
