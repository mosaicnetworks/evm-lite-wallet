import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { ConfigSchema, Static } from 'evm-lite-lib';
import { Button, Card, Divider, Form, Header } from 'semantic-ui-react';

import { Store } from '../redux';
import { ConfigLoadReducer, ConfigSaveReducer } from '../redux/reducers/Configuration';
import { ApplicationConnectivityCheckReducer, ApplicationDirectoryChangeReducer } from '../redux/reducers/Application';

import Config, { ConfigSavePayLoad } from '../redux/actions/Configuration';
import Application, { AppConnectivityPayLoad } from '../redux/actions/Application';
import Defaults from '../classes/Defaults';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	dataDirectoryTask: ApplicationDirectoryChangeReducer;
	configLoadTask: ConfigLoadReducer;
	configSaveTask: ConfigSaveReducer;
	connectivityTask: ApplicationConnectivityCheckReducer;
}

interface DispatchProps {
	handleDataDirectoryChange: (payload: string) => void;
	handleSaveConfig: (payload: ConfigSavePayLoad) => void;
	handleCheckConnectivity: (payload: AppConnectivityPayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

interface State {
	dataDirectory: string;
	fields: {
		connection: {
			host: string,
			port: string,
		};
		defaults: {
			gas: string,
			gasPrice: string,
			from: string,
		};
		storage: {
			keystore: string

		}
	}
}

const configuration = new Config();
const app = new Application();

class Configuration extends React.Component<LocalProps, State> {
	public state = {
		dataDirectory: this.props.dataDirectoryTask.payload || Defaults.dataDirectory,
		fields: {
			connection: {
				host: '',
				port: ''
			},
			defaults: {
				gas: '',
				gasPrice: '',
				from: ''

			},
			storage: {
				keystore: ''
			}
		}
	};

	public componentWillUpdate(nextProps: Readonly<LocalProps>, nextState: Readonly<State>, nextContext: any): void {
		if (this.props.configLoadTask.response &&
			nextProps.configLoadTask.response &&
			!Static.isEquivalentObjects(this.props.configLoadTask.response, nextProps.configLoadTask.response)) {
			this.setVars(nextProps.configLoadTask.response);
		}

		if (!this.props.configLoadTask.response && nextProps.configLoadTask.response) {
			this.setVars(nextProps.configLoadTask.response);
		}

		if (!this.props.configSaveTask.response && nextProps.configSaveTask.response) {
			nextProps.alert.success(nextProps.configSaveTask.response);
		}

		if (this.props.dataDirectoryTask.payload === null &&
			nextProps.dataDirectoryTask.error !== this.props.dataDirectoryTask.error) {
			nextProps.alert.error('There was a problem setting the data directory.');
		}

		if (this.props.dataDirectoryTask.payload !== nextProps.dataDirectoryTask.payload &&
			nextProps.dataDirectoryTask.response) {
			nextProps.alert.success('Data directory changed successfully.');
		}
	}

	public setVars(response: ConfigSchema) {
		this.setState({
			fields: {
				connection: {
					host: response.connection.host,
					port: response.connection.port.toString()
				},
				defaults: {
					from: response.defaults.from,
					gas: response.defaults.gas.toString(),
					gasPrice: response.defaults.gasPrice.toString()
				},
				storage: {
					keystore: response.storage.keystore
				}
			}
		});
	}

	public handleConfigSave = () => {
		const config: ConfigSchema = {
			connection: {
				host: this.state.fields.connection.host,
				port: parseInt(this.state.fields.connection.port, 10)
			},
			storage: {
				keystore: this.state.fields.storage.keystore
			},
			defaults: {
				gas: parseInt(this.state.fields.defaults.gas, 10),
				from: this.state.fields.defaults.from,
				gasPrice: parseInt(this.state.fields.defaults.gasPrice, 10)
			}
		};

		if (this.props.dataDirectoryTask.payload) {
			this.props.handleSaveConfig({
				configSchema: config,
				directory: this.props.dataDirectoryTask.payload,
				name: 'config.toml'
			});
		}
	};

	public handleOnChangeDataDirectory = (e: any) => {
		this.setState({
			dataDirectory: e.target.value
		});
	};

	public handleDataDirectoryChange = () => {
		this.props.handleDataDirectoryChange(this.state.dataDirectory);
	};

	public handleConnectivityCheck = () => {
		this.props.handleCheckConnectivity({
			host: this.state.fields.connection.host,
			port: parseInt(this.state.fields.connection.port, 10)
		});
	};

	public render() {
		return (
			<React.Fragment>
				<div>
					<div className={'page-left-right-padding'}>
						<div>
							<Header as='h3'>
								<Header.Content>
									Data Directory
								</Header.Content>
							</Header>
							<Divider hidden={true}/>
							<Card fluid={true}>
								<Card.Content>
									<Card.Header>Data Directory Change</Card.Header>
									<Card.Meta>
										The data directory specifies a root directory for your keystore and config file.
										Changing this to a directory with
										no keystore folder or config file will automatically generate them.
									</Card.Meta>
									<Divider hidden={true}/>
									<Card.Description>
										<Form>
											<Form.Field>
												<label>Data Directory</label>
												<input onChange={this.handleOnChangeDataDirectory}
													   defaultValue={this.props.dataDirectoryTask.payload
													   || this.state.dataDirectory}/>
											</Form.Field>
										</Form>
									</Card.Description>
								</Card.Content>
								<Card.Content extra={true}>
									<div className=''>
										<Button color={'teal'} fluid={true}
												content='Change Data Directory'
												onClick={this.handleDataDirectoryChange}
												loading={this.props.dataDirectoryTask.isLoading}
												disabled={
													this.props.dataDirectoryTask.isLoading ||
													this.state.dataDirectory === this.props.dataDirectoryTask.payload
												}
										/>
									</div>
								</Card.Content>
							</Card>
						</div>
						<Divider hidden={true}/>
						<div>
							<Header as='h3'>
								<Header.Content>
									Configuration
								</Header.Content>
							</Header>
							<Divider hidden={true}/>
							<Card fluid={true}>
								<Card.Content>
									<Card.Header>Connection Settings</Card.Header>
									<Divider hidden={true}/>
									<Card.Description>
										<Form>
											<Form.Group widths={'equal'}>
												<Form.Input
													label={'Host'}
													placeholder='Host'
													defaultValue={this.state.fields.connection.host}
													onChange={(e) => this.setState({
														fields: {
															...this.state.fields,
															connection: {
																...this.state.fields.connection,
																host: e.target.value
															}
														}
													})}
												/>
												<Form.Input
													label={'Host'}
													placeholder='Port'
													defaultValue={this.state.fields.connection.port.toString()}
													onChange={(e) => this.setState({
														fields: {
															...this.state.fields,
															connection: {
																...this.state.fields.connection,
																port: e.target.value
															}
														}
													})}
												/>
											</Form.Group>
										</Form>
									</Card.Description>
								</Card.Content>
								<Card.Content extra={true}>
									<div className=''>
										<Button color={'blue'} fluid={true}
												content='Test Connection'
												loading={this.props.connectivityTask.isLoading}
												disabled={this.props.connectivityTask.isLoading}
												onClick={this.handleConnectivityCheck}
										/>
									</div>
								</Card.Content>
							</Card>
							<Card fluid={true}>
								<Card.Content>
									<Card.Header>Default Transaction Values</Card.Header>
									<Divider hidden={true}/>
									<Card.Description>
										<Form>
											<Form.Group widths='equal'>
												<Form.Field>
													<label>From</label>
													<input defaultValue={this.state.fields.defaults.from}
														   onChange={(e) => this.setState({
															   fields: {
																   ...this.state.fields,
																   defaults: {
																	   ...this.state.fields.defaults,
																	   from: e.target.value
																   }
															   }
														   })}
													/>
												</Form.Field>
												<Form.Field>
													<label>Gas</label>
													<input defaultValue={this.state.fields.defaults.gas.toString()}
														   onChange={(e) => this.setState({
															   fields: {
																   ...this.state.fields,
																   defaults: {
																	   ...this.state.fields.defaults,
																	   gas: e.target.value
																   }
															   }
														   })}/>
												</Form.Field>
												<Form.Field>
													<label>Gas Price</label>
													<input defaultValue={this.state.fields.defaults.gasPrice.toString()}
														   onChange={(e) => this.setState({
															   fields: {
																   ...this.state.fields,
																   defaults: {
																	   ...this.state.fields.defaults,
																	   gasPrice: e.target.value
																   }
															   }
														   })}/>
												</Form.Field>
											</Form.Group>
										</Form>
									</Card.Description>
								</Card.Content>
							</Card>
							<Card fluid={true}>
								<Card.Content>
									<Card.Header>Storage Settings</Card.Header>
									<Divider hidden={true}/>
									<Card.Description>
										<Form>
											<Form.Field>
												<label>Keystore</label>
												<input defaultValue={this.state.fields.storage.keystore}
													   onChange={(e) => this.setState({
														   fields: {
															   ...this.state.fields,
															   storage: {
																   ...this.state.fields.storage,
																   keystore: e.target.value
															   }
														   }
													   })}/>
											</Form.Field>
										</Form>
									</Card.Description>
								</Card.Content>
							</Card>
							<Divider hidden={true}/>
							<Form>
								<Form.Field>
									<Button fluid={true} loading={this.props.configSaveTask.isLoading}
											disabled={this.props.configSaveTask.isLoading}
											onClick={this.handleConfigSave} color={'green'}>
										Save
									</Button>
								</Form.Field>
							</Form>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	configSaveTask: store.config.save,
	dataDirectoryTask: store.app.directory,
	configLoadTask: store.config.load,
	connectivityTask: store.app.connectivity
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleSaveConfig: payload => dispatch(configuration.handlers.save.init(payload)),
	handleCheckConnectivity: payload => dispatch(app.handlers.connectivity.init(payload)),
	handleDataDirectoryChange: payload => dispatch(app.handlers.directory.init(payload))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(Configuration));
