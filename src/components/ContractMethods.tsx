import * as React from 'react';

import { connect } from 'react-redux';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { Accordion, Form, Input, Select, Divider } from 'semantic-ui-react';
import { ABI, Contract } from 'evm-lite-lib';

import { KeystoreListReducer, Store } from '../redux';

import ContractMethod from './ContractMethod';

interface State {
	activeIndex: number;
	fields: {
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

interface OwnProps {
	contract: Contract<any>;
	contractABI: ABI[];
}

interface StoreProps {
	keystoreListTask: KeystoreListReducer;
}

interface DispatchProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class ContractMethods extends React.Component<LocalProps, State> {
	public state = {
		activeIndex: 0,
		fields: {
			from: '',
			gas: '',
			gasPrice: '',
			value: '',
			password: ''
		}
	};

	public handleClick = (e: any, titleProps: any) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;

		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
	};

	public handleChangeFrom = (e: any, { value }) => {
		this.setState(
			{
				fields: {
					...this.state.fields,
					from: value
				}
			},
			() => {
				console.log(this.state.fields.from);
			}
		);
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

	public render() {
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
				<Form>
					<Form.Group widths="equal">
						<Form.Field>
							<label>From</label>
							<Select
								size="mini"
								onChange={this.handleChangeFrom}
								placeholder="Select an Account"
								options={accounts}
							/>
						</Form.Field>
						{true ? (
							<Form.Field>
								<label>Password</label>
								<Input
									size="mini"
									onChange={this.handlePasswordChange}
									type={'password'}
								/>
							</Form.Field>
						) : null}
					</Form.Group>
					<Form.Group widths="equal">
						{true ? (
							<Form.Field>
								<label>Value</label>
								<Input
									size="mini"
									onChange={this.handleChangeValue}
									type={'number'}
								/>
							</Form.Field>
						) : null}
						<Form.Field>
							<label>Gas</label>
							<Input
								size="mini"
								onChange={this.handleChangeGas}
								type={'number'}
								defaultValue={this.state.fields.gas}
							/>
						</Form.Field>
						<Form.Field>
							<label>Gas Price</label>
							<Input
								size="mini"
								onChange={this.handleChangeGasPrice}
								type={'number'}
								defaultValue={this.state.fields.gasPrice}
							/>
						</Form.Field>
					</Form.Group>
				</Form>
				<Divider clearing={true} />
				<Accordion fluid={true} styled={true}>
					{Object.keys(this.props.contract.methods).map(
						(method, index) => {
							return (
								<ContractMethod
									fields={this.state.fields}
									key={method}
									contract={this.props.contract}
									index={index}
									method={method}
									abi={
										this.props.contractABI.filter(abi => {
											return abi.name === method;
										})[0]
									}
									handleClick={this.handleClick}
									activeIndex={this.state.activeIndex}
								/>
							);
						}
					)}
				</Accordion>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	keystoreListTask: store.keystore.list
});

const mapsDispatchToProps = (): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(ContractMethods));
