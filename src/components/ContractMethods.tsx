import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { Accordion } from 'semantic-ui-react';
import { ABI, Contract } from 'evm-lite-lib';

import ContractMethod from './ContractMethod';

interface State {
	activeIndex: number;
}

interface AlertProps {
	alert: InjectedAlertProp;
}

interface OwnProps {
	contract: Contract<any>;
	contractABI: ABI[];
}

type LocalProps = OwnProps & AlertProps;

class ContractMethods extends React.Component<LocalProps, State> {
	public state = {
		activeIndex: 0
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
				<Accordion fluid={true} styled={true}>
					{Object.keys(this.props.contract.methods).map(
						(method, index) => {
							return (
								<ContractMethod
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

export default withAlert(ContractMethods);
