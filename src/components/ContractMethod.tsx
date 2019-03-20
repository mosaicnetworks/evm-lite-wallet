import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { ABI, Contract, Transaction, Keystore, Account } from 'evm-lite-lib';
import {
	Accordion,
	Form,
	Input,
	Select,
	Icon,
	Label,
	Button,
	Grid,
	Divider
} from 'semantic-ui-react';

import { Store, ConfigLoadReducer, KeystoreListReducer } from '../redux';

import ContractMethodResponse from './ContractMethodResponse';

interface State {
	loading: boolean;
	response: any;
	fields: {
		params: any[];
		from: string;
		gas: string;
		gasPrice: string;
		value: string;
		password: string;
	};
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
	contract: Contract<any>;
	index: number;
	method: string;
	abi: ABI;
	handleClick: any;
	activeIndex: number;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class ContractMethod extends React.Component<LocalProps, State> {
	public state = {
		response: null,
		loading: false,
		fields: {
			params: [],
			from: '',
			gas: '',
			gasPrice: '',
			value: '',
			password: ''
		}
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
		this.setState({
			fields: {
				...this.state.fields,
				password: value
			}
		});
	};

	public getInputs = () => {
		return this.props.abi.inputs.map((input, index) => {
			return (
				<Form.Field key={input.name}>
					<label>
						{input.name} ({input.type})
					</label>
					<Input
						onChange={(e: any) => {
							const params: any[] = this.state.fields.params;

							while (
								params.length > this.props.abi.inputs.length
							) {
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
						}}
						type={input.type.includes('int') ? 'number' : 'text'}
					/>
				</Form.Field>
			);
		});
	};

	public handleSubmitMethod = async (e: any) => {
		this.setState({ loading: true });

		const method = e.target.value;
		const constants = {
			constant: this.props.abi.constant,
			payable: this.props.abi.payable
		};
		const transaction: Transaction = await this.props.contract.methods[
			method
		](...this.state.fields.params);
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

		if (!constants.constant) {
			await transaction.submit(account, {
				timeout: 2,
				from: this.state.fields.from,
				gas: parseInt(this.state.fields.gas, 10),
				gasPrice: parseInt(this.state.fields.gasPrice, 10)
			});

			this.setState({
				response: await transaction.receipt,
				loading: false
			});
		} else {
			const response = await transaction.submit(null, {
				from: this.state.fields.from,
				gas: parseInt(this.state.fields.gas, 10),
				gasPrice: parseInt(this.state.fields.gasPrice, 10)
			});

			this.setState({
				response,
				loading: false
			});
		}
	};

	public render() {
		const { activeIndex, index } = this.props;

		const constants = {
			constant: this.props.abi.constant,
			payable: this.props.abi.payable
		};

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
			<React.Fragment>
				<Accordion.Title
					active={activeIndex === index}
					index={index}
					onClick={this.props.handleClick}
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
					{this.props.method}
				</Accordion.Title>
				<Accordion.Content active={activeIndex === index}>
					<Grid divided={true}>
						<Grid.Column
							style={{ background: '#FAFAFA !important' }}
							width={8}
						>
							<Form>{this.getInputs()}</Form>
							<Divider hidden={true} />
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
										value={this.props.method}
										type={'submit'}
										color="green"
										onClick={this.handleSubmitMethod}
									>
										Submit
									</Button>
								</Form.Field>
							</Form>
						</Grid.Column>
						<Grid.Column width={8}>
							{this.state.response ? (
								<ContractMethodResponse
									response={this.state.response!}
									outputs={this.props.abi.outputs || []}
								/>
							) : (
								''
							)}
						</Grid.Column>
					</Grid>
				</Accordion.Content>
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
)(withAlert<AlertProps>(ContractMethod));
