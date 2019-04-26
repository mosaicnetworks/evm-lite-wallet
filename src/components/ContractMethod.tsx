import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { ABI, Contract, Transaction, Keystore, Account } from 'evm-lite-lib';
import {
	Accordion,
	Form,
	Input,
	Icon,
	Label,
	Button,
	Divider
} from 'semantic-ui-react';

import { Store, ConfigLoadReducer } from '../redux';

import ContractMethodResponse from './ContractMethodResponse';

interface State {
	loading: boolean;
	response: any;
	fields: {
		params: any[];
	};
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	configLoadTask: ConfigLoadReducer;
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
	fields: {
		gas: string;
		gasPrice: string;
		from: string;
		password: string;
		value: string;
	};
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class ContractMethod extends React.Component<LocalProps, State> {
	public state = {
		response: null,
		loading: false,
		fields: {
			params: []
		}
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

		let account: Account | undefined;

		if (!constants.constant) {
			account = await keystore.decrypt(
				this.props.fields.from,
				this.props.fields.password
			);
		}

		if (!constants.constant) {
			console.log('STATE', this.state);

			await transaction.submit(account || undefined, {
				timeout: 4,
				from: this.props.fields.from,
				gas: parseInt(this.props.fields.gas, 10),
				gasPrice: parseInt(this.props.fields.gasPrice, 10)
			});

			console.log(this.props.fields.from);

			this.setState({
				response: await transaction.receipt,
				loading: false
			});
		} else {
			const response = await transaction.submit(account || undefined, {
				timeout: 4,
				from: this.props.fields.from,
				gas: parseInt(this.props.fields.gas, 10),
				gasPrice: parseInt(this.props.fields.gasPrice, 10)
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
					<Form>{this.getInputs()}</Form>
					<Divider hidden={true} />
					<Form>
						<Form.Field>
							<Button
								value={this.props.method}
								type={'submit'}
								color="teal"
								onClick={this.handleSubmitMethod}
							>
								Execute
							</Button>
						</Form.Field>
					</Form>
					{this.state.response ? (
						<ContractMethodResponse
							response={this.state.response!}
							outputs={this.props.abi.outputs || []}
						/>
					) : (
						''
					)}
				</Accordion.Content>
			</React.Fragment>
		);
	}
}
const mapStoreToProps = (store: Store): StoreProps => ({
	configLoadTask: store.config.load
});

const mapsDispatchToProps = (): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(ContractMethod));
