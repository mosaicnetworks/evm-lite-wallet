import * as React from 'react';

import styled from 'styled-components';

import { Static } from 'evm-lite-lib';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { Form, Grid, Header, Input } from 'semantic-ui-react';

import { Store } from 'src/store';
import { ConfigurationState, setDirectory } from '../modules/configuration';

import { Banner, Jumbo } from '../components';

import './styles/Configuration.css';

const Description = styled.div`
	margin: 40px;
`;

const Column = styled(Grid.Column)`
	background: #fff;
	margin: 4px;
	padding: 0 !important;

	& > div {
		padding: 20px;
		padding-top: 0 !important;
	}

	& .form {
		padding: 10px;
		padding-top: 0;
	}

	& h3 {
		padding: 10px 20px;
		color: #333;
		background: #fbfbfb;
		border-bottom: 1px solid #f4f5f7;
	}
`;

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	config: ConfigurationState;
}

interface DispatchProps {
	handleSetDataDirectory: (path: string) => void;
}

interface State {
	fields: {
		dataDirectory: string;
		keystore: string;
		gas: number;
		gasPrice: number;
		from: string;
	};
}

type LocalProps = StoreProps & AlertProps & DispatchProps;

class Configuration extends React.Component<LocalProps, State> {
	public state = {
		fields: {
			dataDirectory: this.props.config.directory,
			keystore: '',
			gas: 0,
			gasPrice: 0,
			from: ''
		}
	};

	public componentDidMount() {
		if (this.props.config.directory) {
			console.log('Workgin');
			this.setState(
				{
					fields: {
						...this.state.fields,
						dataDirectory: this.props.config.directory
					}
				},
				() => {
					if (this.props.config.data.defaults) {
						const config = this.props.config.data;

						this.setState({
							fields: {
								...this.state.fields,
								keystore: config.storage.keystore,
								gas: config.defaults.gas,
								gasPrice: config.defaults.gasPrice
							}
						});
					}
				}
			);
		}
	}

	public componentWillReceiveProps(nextProps: LocalProps) {
		if (nextProps.config.directory !== this.props.config.directory) {
			this.setState({
				fields: {
					...this.state.fields,
					dataDirectory: nextProps.config.directory
				}
			});
		}

		if (nextProps.config.data.defaults) {
			const config = nextProps.config.data;

			this.setState({
				fields: {
					...this.state.fields,
					keystore: config.storage.keystore,
					gas: config.defaults.gas,
					gasPrice: config.defaults.gasPrice
				}
			});
		}
	}

	public readonly handleSetDataDirectory = () => {
		const { fields } = this.state;

		if (!fields.dataDirectory) {
			this.props.alert.error('Data directory field cannot be empty.');
			return;
		}

		if (
			Static.exists(fields.dataDirectory) &&
			!Static.isDirectory(fields.dataDirectory)
		) {
			this.props.alert.error('The path given is not a directory.');
			return;
		}

		this.props.handleSetDataDirectory(fields.dataDirectory);
	};

	public handleSaveConfig = () => {
		console.log(this.state.fields);
	};

	public render() {
		const { config } = this.props;

		return (
			<React.Fragment>
				<Jumbo>
					<Header as="h2" floated="left">
						Configuration
						<Header.Subheader>
							{config.directory || ''}
						</Header.Subheader>
					</Header>
					<Header as="h2" floated="right">
						<Header.Subheader>
							<Input
								compact={true}
								action={{
									color: 'purple',
									labelPosition: 'right',
									icon: 'folder',
									content: 'Set',
									onClick: this.handleSetDataDirectory
								}}
								onChange={(_, { value }) =>
									this.setState({
										...this.state,
										fields: {
											...this.state.fields,
											dataDirectory: value
										}
									})
								}
								defaultValue={config.directory}
							/>
						</Header.Subheader>
					</Header>
				</Jumbo>
				<Banner color="black">
					These configuration values will be read in by all actions
					across the wallet and other evm-lite applications as default
					values.
				</Banner>
				<Description>
					<Grid columns="equal">
						<Column>
							<h3>Connection</h3>
							<div>
								The node's connection details. These will be
								used to fetch account details.
							</div>
							<div className="form">
								<Form>
									<Form.Field>
										<label>Host</label>
										<Input placeholder="ex: 127.0.0.1" />
									</Form.Field>
									<Form.Field>
										<label>Port</label>
										<Input placeholder="ex: 8080" />
									</Form.Field>
								</Form>
							</div>
						</Column>
						<Column>
							<h3>Defaults</h3>
							<div>
								These values will be used as defaults for any
								transactions sent.
							</div>
							<div className="form">
								<Form>
									<Form.Field>
										<label>From</label>
										<Input placeholder="ex: 0x5c3e95864f7eb2fd0789848f0a3368aa67b8439c" />
									</Form.Field>
									<Form.Field>
										<label>Gas</label>
										<Input
											type="number"
											placeholder="ex: 10000"
										/>
									</Form.Field>
									<Form.Field>
										<label>Gas Price</label>
										<Input
											type="number"
											placeholder="ex: 0"
										/>
									</Form.Field>
								</Form>
							</div>
						</Column>
						<Column>
							<h3>Storage</h3>
							<div>
								The keystore is the directory where any accounts
								created or imported will be placed.
							</div>
							<div className="form">
								<Form>
									<Form.Field>
										<label>Keystore</label>
										<Input placeholder="ex: /home/tom/.evmlc" />
									</Form.Field>
								</Form>
							</div>
						</Column>
					</Grid>
				</Description>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	config: store.config
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleSetDataDirectory: path => dispatch(setDirectory(path))
});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<LocalProps>(Configuration));
