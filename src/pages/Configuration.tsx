import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { ConfigSchema, Static } from 'evm-lite-lib';
import { Button, Divider, Form, Header, Icon } from 'semantic-ui-react';

import { Store } from '../redux';
import { ConfigLoadReducer } from '../redux/reducers/Configuration';

import Config, { ConfigSavePayLoad } from '../redux/actions/Configuration';


interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	dataDirectory: string | null;
	configLoadTask: ConfigLoadReducer;
}

interface DispatchProps {
	handleSaveConfig: (payload: ConfigSavePayLoad) => void;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

interface State {
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

class Configuration extends React.Component<LocalProps, State> {
	public state = {
		fields: {
			connection: {
				host:
					this.props.configLoadTask.response &&
					this.props.configLoadTask.response.connection.host || '',
				port:
					this.props.configLoadTask.response &&
					this.props.configLoadTask.response.connection.port.toString() || ''
			},
			defaults: {
				gas:
					this.props.configLoadTask.response &&
					this.props.configLoadTask.response.defaults.gas.toString() || '',
				gasPrice:
					this.props.configLoadTask.response &&
					this.props.configLoadTask.response.defaults.gasPrice.toString() || '',
				from:
					this.props.configLoadTask.response &&
					this.props.configLoadTask.response.defaults.from || ''

			},
			storage: {
				keystore:
					this.props.configLoadTask.response &&
					this.props.configLoadTask.response.storage.keystore || ''
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

		if (this.props.dataDirectory) {
			this.props.handleSaveConfig({
				configSchema: config,
				directory: this.props.dataDirectory,
				name: 'config.toml'
			});
		}
	};

	public render() {
		const { dataDirectory } = this.props;
		return (
			<React.Fragment>
				<Header as='h2'>
					<Icon name='cog'/>
					<Header.Content>
						Configuration
						<Header.Subheader>Location: {dataDirectory}/config.toml</Header.Subheader>
					</Header.Content>
					<Divider/>
				</Header>
				<Divider hidden={true}/>
				<div className={'page'}>
					<Form>
						<Form.Group widths='equal'>
							<Form.Field>
								<label>Host</label>
								<input defaultValue={this.state.fields.connection.host}
									   onChange={(e) => this.setState({
										   fields: {
											   ...this.state.fields,
											   connection: {
												   ...this.state.fields.connection,
												   host: e.target.value
											   }
										   }
									   })}/>
							</Form.Field>
							<Form.Field>
								<label>Port</label>
								<input defaultValue={this.state.fields.connection.port.toString()}
									   onChange={(e) => this.setState({
										   fields: {
											   ...this.state.fields,
											   connection: {
												   ...this.state.fields.connection,
												   port: e.target.value
											   }
										   }
									   })}/>
							</Form.Field>
						</Form.Group>
					</Form>
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
									   })}/>
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
					<Divider hidden={true}/>
					<Form>
						<Form.Field>
							<Button icon={true} onClick={this.handleConfigSave} color={'green'}><Icon name='save'/> Save</Button>
						</Form.Field>
					</Form>
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	dataDirectory: store.app.directory.payload,
	configLoadTask: store.config.load
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
	handleSaveConfig: (data: ConfigSavePayLoad) => dispatch(configuration.handlers.save.init(data))
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapDispatchToProps
)(withAlert<AlertProps>(Configuration));
