import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { Spring, config } from 'react-spring/renderprops';
import { Header, Message, Form, Grid, Select } from 'semantic-ui-react';

import { Store, DataDirectorySetReducer, ConfigLoadReducer } from '../redux';
import { PaddedContent } from '../components/Styling';

import Heading from '../components/Heading';
import Misc from '../classes/Misc';

import './styles/Configuration.css';

const Section = styled.div`
	background: #fff !important;
	padding: 30px !important;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.03) !important;
`;

const BlackNotificationBanner = styled.div`
	background: #222 !important;
	color: #fff !important;
	padding: 20px;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
	position: relative;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;

	&:before,
	&:after {
		content: '';
		position: absolute;
		z-index: -1;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
		top: 0;
		bottom: 0;
		left: 10px;
		right: 10px;
	}
`;

interface StoreProps {
	dataDirectorySetTask: DataDirectorySetReducer;
	configLoadTask: ConfigLoadReducer;
}

interface State {
	fields: {
		dataDirectory: string;
		keystore: string;
		gas: string;
		gasPrice: string;
		from: string;
	};
}

type LocalProps = StoreProps;

class Configuration extends React.Component<LocalProps, State> {
	public state = {
		fields: {
			dataDirectory: '',
			keystore: '',
			gas: '',
			gasPrice: '',
			from: ''
		}
	};

	public componentDidMount() {
		if (this.props.dataDirectorySetTask.response) {
			console.log('DANU: ', this.props.dataDirectorySetTask.response);
			this.setState(
				{
					fields: {
						...this.state.fields,
						dataDirectory: this.props.dataDirectorySetTask.response
					}
				},
				() => console.log(this.state)
			);
		}

		if (!!this.props.configLoadTask.response) {
			const config = this.props.configLoadTask.response;
			console.log(this.state.fields);
			this.setState(
				{
					fields: {
						...this.state.fields,
						keystore: config.storage.keystore,
						gas: config.defaults.gas.toString(),
						gasPrice: config.defaults.gasPrice.toString()
					}
				},
				() => console.log('STATE', this.state)
			);
		}
	}

	public componentWillReceiveProps(nextProps: LocalProps) {
		if (
			nextProps.dataDirectorySetTask.response &&
			this.state.fields.dataDirectory !==
				nextProps.dataDirectorySetTask.response
		) {
			this.setState({
				fields: {
					...this.state.fields,
					dataDirectory: nextProps.dataDirectorySetTask.response
				}
			});
		}

		if (
			!this.props.configLoadTask.response &&
			nextProps.configLoadTask.response
		) {
			const config = nextProps.configLoadTask.response;

			this.setState({
				fields: {
					...this.state.fields,
					keystore: config.storage.keystore,
					gas: config.defaults.gas.toString(),
					gasPrice: config.defaults.gasPrice.toString()
				}
			});
		}
	}

	public readonly handleSetDataDirectory = () => {
		console.log(this.state);
	};

	public render() {
		const { dataDirectorySetTask, configLoadTask } = this.props;
		const { fields } = this.state;

		return (
			<React.Fragment>
				<Heading
					heading={'Configuration'}
					subHeading={
						(dataDirectorySetTask.response &&
							dataDirectorySetTask.payload) ||
						''
					}
				/>
				<BlackNotificationBanner>
					These configuration values will be read in by all actions
					across the wallet and other evm-lite applications as default
					values.
				</BlackNotificationBanner>
				<br />
				<br />
				<PaddedContent>
					<Header as="h3">
						Data Directory (
						{(dataDirectorySetTask.response &&
							dataDirectorySetTask.payload) ||
							'N/A'}
						)
					</Header>
				</PaddedContent>
				{dataDirectorySetTask.response && (
					<Spring
						from={{
							marginRight: -Misc.MARGIN_CONSTANT,
							opacity: 0
						}}
						to={{
							marginRight: 0,
							opacity: 1
						}}
						config={config.wobbly}
					>
						{props => (
							<Section style={props}>
								<Message info={true}>
									Note: This must be an absolute path.
								</Message>
								<div>
									<Form.Group>
										<Form.Input
											fluid={true}
											icon="folder"
											placeholder={
												(dataDirectorySetTask.response &&
													dataDirectorySetTask.payload) ||
												'N/A'
											}
											defaultValue={fields.dataDirectory}
										/>
										<br />
										<Form.Button
											color="blue"
											content="Set"
											onClick={
												this.handleSetDataDirectory
											}
										/>
									</Form.Group>
								</div>
							</Section>
						)}
					</Spring>
				)}
				<br />
				<br />
				<PaddedContent>
					<Header as="h3">Defaults & Keystore</Header>
				</PaddedContent>
				<br />
				{configLoadTask.response && (
					<Spring
						from={{
							marginRight: -Misc.MARGIN_CONSTANT,
							opacity: 0
						}}
						to={{
							marginRight: 0,
							opacity: 1
						}}
						config={config.wobbly}
					>
						{props => (
							<Grid style={props} columns="equal">
								<Grid.Column className="data">
									<div>
										<Form.Group>
											<Select
												fluid={true}
												placeholder={fields.from}
												options={[]}
												defaultValue={fields.from}
											/>
										</Form.Group>
										<Form.Group>
											<Form.Input
												type="number"
												fluid={true}
												placeholder="Default Gas"
												defaultValue={fields.gas}
											/>
										</Form.Group>
										<Form.Group>
											<Form.Input
												type="number"
												fluid={true}
												placeholder="Default Gas Price"
												defaultValue={
													fields.gasPrice || ''
												}
											/>
										</Form.Group>
										<br />
										<Form.Group>
											<Form.Button
												color="blue"
												content="Set"
											/>
										</Form.Group>
									</div>
								</Grid.Column>
								<Grid.Column className="data">
									<div>
										<Form.Group>
											<Form.Input
												fluid={true}
												icon="folder"
												placeholder={
													'Keystore Directory'
												}
												defaultValue={fields.keystore}
											/>
											<br />
											<Form.Button
												color="blue"
												content="Set"
											/>
										</Form.Group>
									</div>
								</Grid.Column>
							</Grid>
						)}
					</Spring>
				)}
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	dataDirectorySetTask: store.dataDirectory.setDirectory,
	configLoadTask: store.config.load
});

const mapsDispatchToProps = (dispatch: any) => ({});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(Configuration);
