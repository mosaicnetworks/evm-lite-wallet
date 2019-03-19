import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Contract, EVMLC, Keystore, Account } from 'evm-lite-lib';
import {
	Accordion,
	Button,
	Card,
	Divider,
	Icon,
	Form,
	Input,
	Select,
	Label,
	TextArea,
	Grid
} from 'semantic-ui-react';

import { Store, ConfigLoadReducer, KeystoreListReducer } from '../redux';

import './styles/Accounts.css';
import { ABI } from 'evm-lite-lib/src/evm-lite-core/dist/classes/contract/Contract';

interface State {
	fields: {
		address: string;
		abi: string;
		from: string;
		gas: string;
		gasPrice: string;
		value: string;
		params: any[];
		password: string;
	};
	loading: boolean;
	submitLoading: boolean;
	contract: Contract<any> | null;
	activeIndex: number;
	transactionResponse: any;
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
		transactionResponse: null,
		loading: false,
		submitLoading: false,
		contract: null,
		fields: {
			params: [],
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
			address: '0x547fa88574bfc6c2f9dee7d817f368908de02189',
			gas:
				(this.props.configLoadTask.response &&
					this.props.configLoadTask.response.defaults.gas.toString()) ||
				'',
			gasPrice:
				(this.props.configLoadTask.response &&
					this.props.configLoadTask.response.defaults.gasPrice.toString()) ||
				'',
			value: '',
			from:
				(this.props.configLoadTask.response &&
					this.props.configLoadTask.response.defaults.from.toString()) ||
				'',
			password: ''
		},
		activeIndex: 0
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
		} catch (e) {
			this.props.alert.error(
				'Something went wrong trying to generate contract.'
			);
		}

		this.setState({
			loading: false
		});
	};

	public getInputs = (method: string) => {
		const abi: ABI = JSON.parse(this.state.fields.abi).filter(
			(abi: ABI) => {
				return abi.name === method;
			}
		)[0];

		const inputs = abi.inputs;

		return inputs.map((input, index) => {
			return (
				<Form.Field key={input.name}>
					<label>
						{input.name} ({input.type})
					</label>
					<Input
						onChange={(e: any) => {
							const params: any[] = this.state.fields.params;

							while (params.length > inputs.length) {
								params.pop();
							}

							let value: any = e.target.value;

							if (input.type.includes('int')) {
								value = parseInt(value, 10);
							}

							params[index] = value;

							this.setState({
								fields: {
									...this.state.fields,
									params
								}
							});

							console.log(this.state.fields.params);
						}}
						type={input.type.includes('int') ? 'number' : 'text'}
					/>
				</Form.Field>
			);
		});
	};

	public checkConstantOrPayable = (method: string) => {
		const abi: ABI = JSON.parse(this.state.fields.abi).filter(
			(abi: ABI) => {
				return abi.name === method;
			}
		)[0];

		return {
			constant: abi.constant,
			payable: abi.payable
		};
	};

	public getMethods = () => {
		// @ts-ignore
		const contract: Contract<any> = this.state.contract;
		const { activeIndex } = this.state;

		if (contract) {
			return Object.keys(contract.methods).map((key, index) => {
				const constants = this.checkConstantOrPayable(key);
				const accounts = this.props.keystoreListTask.response!.map(
					({ address }) => {
						return {
							key: address,
							value: address,
							text: address
						};
					}
				);
				return (
					<React.Fragment key={key}>
						<Accordion.Title
							active={activeIndex === index}
							index={index}
							onClick={this.handleClick}
						>
							<Icon name="dropdown" />
							{constants.constant ? (
								<Label size={'tiny'} color={'yellow'}>
									Constant
								</Label>
							) : null}
							{constants.payable ? (
								<Label size={'tiny'} color={'blue'}>
									Payable
								</Label>
							) : null}
							{'  '}
							{key}
						</Accordion.Title>
						<Accordion.Content active={activeIndex === index}>
							<Form>{this.getInputs(key)}</Form>
							<Divider />
							<Form>
								<Form.Group widths="equal">
									<Form.Field>
										<label>From</label>
										<Select
											onChange={this.handleChangeFrom}
											placeholder="Select an Account"
											options={accounts}
										/>
									</Form.Field>
									{!constants.constant ? (
										<Form.Field>
											<label>Password</label>
											<Input
												onChange={
													this.handlePasswordChange
												}
												type={'password'}
											/>
										</Form.Field>
									) : null}
								</Form.Group>

								<Form.Group widths="equal">
									{constants.payable ? (
										<Form.Field>
											<label>Value</label>
											<Input
												onChange={
													this.handleChangeValue
												}
												type={'number'}
											/>
										</Form.Field>
									) : null}
									<Form.Field>
										<label>Gas</label>
										<Input
											onChange={this.handleChangeGas}
											type={'number'}
											defaultValue={this.state.fields.gas}
										/>
									</Form.Field>
									<Form.Field>
										<label>Gas Price</label>
										<Input
											onChange={this.handleChangeGasPrice}
											type={'number'}
											defaultValue={
												this.state.fields.gasPrice
											}
										/>
									</Form.Field>
								</Form.Group>
								<Form.Field>
									<Button
										value={key}
										type={'submit'}
										color="green"
										onClick={this.handleSubmitMethod}
									>
										Submit
									</Button>
								</Form.Field>
							</Form>
						</Accordion.Content>
					</React.Fragment>
				);
			});
		} else {
			return;
		}
	};

	public handleSubmitMethod = async (e: any) => {
		this.setState({
			submitLoading: true
		});

		// @ts-ignore
		const contract: Contract<any> = this.state.contract;
		const method = e.target.value;
		const constants = this.checkConstantOrPayable(method);
		const transaction = await contract.methods[method](
			...this.state.fields.params
		);
		const keystore = new Keystore(
			this.props.configLoadTask.response!.storage.keystore
		);

		let account: Account | null = null;

		if (!constants.constant) {
			account = await keystore.decrypt(
				this.state.fields.from,
				this.state.fields.password
			);
		}

		console.log(transaction.parse());

		if (!constants.constant) {
			await transaction.submit(account, {
				from: this.state.fields.from,
				gas: parseInt(this.state.fields.gas, 10),
				gasPrice: parseInt(this.state.fields.gasPrice, 10)
			});

			this.setState({
				transactionResponse: await transaction.receipt,
				submitLoading: false
			});
		} else {
			const response = await transaction.submit(account, {
				from: this.state.fields.from,
				gas: parseInt(this.state.fields.gas, 10),
				gasPrice: parseInt(this.state.fields.gasPrice, 10)
			});

			this.setState({
				transactionResponse: response,
				submitLoading: false
			});
		}
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

	public handleChangeFrom = (e: any, { value }) => {
		this.setState({
			fields: {
				...this.state.fields,
				from: value
			}
		});
	};

	public handleChangeGas = (e: any, { value }) => {
		this.setState({
			fields: {
				...this.state.fields,
				gas: value
			}
		});
	};

	public handleChangeGasPrice = (e: any, { value }) => {
		this.setState({
			fields: {
				...this.state.fields,
				gasPrice: value
			}
		});
	};

	public handleChangeValue = (e: any, { value }) => {
		this.setState({
			fields: {
				...this.state.fields,
				value
			}
		});
	};

	public handlePasswordChange = (e: any, { value }) => {
		console.log(value);
		this.setState({
			fields: {
				...this.state.fields,
				password: value
			}
		});
	};

	public handleClick = (e: any, titleProps: any) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;

		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
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
							<div className="">
								<Grid coloums={2}>
									<Grid.Column width={8}>
										<Accordion fluid={true} styled={true}>
											{this.getMethods()}
										</Accordion>
									</Grid.Column>
									<Grid.Column width={8}>
										{this.state.transactionResponse &&
											JSON.stringify(
												this.state.transactionResponse,
												null,
												4
											)}
									</Grid.Column>
								</Grid>
							</div>
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
