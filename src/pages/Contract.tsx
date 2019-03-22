import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Contract, EVMLC } from 'evm-lite-lib';
import {
	Button,
	Card,
	Divider,
	Form,
	Input,
	TextArea
} from 'semantic-ui-react';

import { Store, ConfigLoadReducer, KeystoreListReducer } from '../redux';

import ContractMethods from '../components/ContractMethods';

import './styles/Accounts.css';

interface State {
	fields: {
		address: string;
		abi: string;
	};
	loading: boolean;
	contract: Contract<any> | null;
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	configLoadTask: ConfigLoadReducer;
	keystoreListTask: KeystoreListReducer;
}

interface DispatchProps {
	empty?: null;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Accounts extends React.Component<LocalProps, State> {
	public state = {
		loading: false,
		contract: null,
		fields: {
			abi:
				'[{"constant":false,"inputs":[],"name":"getKeys","outputs":[],' +
				'"payable":false,"stateMutability":"nonpayable","type":' +
				'"function"},{"constant":false,"inputs":[{"name":"pubKey"' +
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

	public loadContract = async (e: any) => {
		this.setState({
			loading: true
		});

		try {
			const config = this.props.configLoadTask.response!;
			const evmlc = new EVMLC(
				config.connection.host,
				config.connection.port,
				{
					from: config.defaults.from,
					gas: config.defaults.gas,
					gasPrice: config.defaults.gasPrice
				}
			);

			const contract = await evmlc.contracts.load(
				JSON.parse(this.state.fields.abi),
				{
					contractAddress: this.state.fields.address
				}
			);

			this.setState({
				contract
			});

			console.log(evmlc);
		} catch (e) {
			this.props.alert.error(
				'Something went wrong trying to generate contract.'
			);
		}

		this.setState({
			loading: false
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
				<div className={'page-left-right-padding'}>
					<Card fluid={true}>
						<Card.Content>
							<Card.Header>Contract Abstraction</Card.Header>
							<Card.Meta>
								Enter to address of the contract.
							</Card.Meta>
							<Divider hidden={true} />
							<Card.Description>
								<Form>
									<Form.Field>
										<label>Contract Address</label>
										<Input
											onChange={this.handleAddressChange}
											defaultValue={
												this.state.fields.address
											}
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
							</Card.Description>
						</Card.Content>
						<Card.Content extra={true}>
							<div className="">
								<Button
									color={'teal'}
									fluid={true}
									loading={this.state.loading}
									onClick={this.loadContract}
									content="Load Contract"
								/>
							</div>
						</Card.Content>
						<Card.Content
							style={{
								display: this.state.contract ? 'block' : 'none'
							}}
						>
							<Card.Header>Methods</Card.Header>
							<Divider hidden={true} />
							{this.state.contract ? (
								<ContractMethods
									contract={this.state.contract!}
									contractABI={JSON.parse(
										this.state.fields.abi
									)}
								/>
							) : (
								''
							)}
						</Card.Content>
					</Card>
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	configLoadTask: store.config.load,
	keystoreListTask: store.keystore.list
});

const mapsDispatchToProps = (): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
