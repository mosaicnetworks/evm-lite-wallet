import * as React from 'react';

import styled from 'styled-components';

import { connect } from 'react-redux';
import { Spring, config } from 'react-spring/renderprops';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Header, Message, Form, Grid } from 'semantic-ui-react';
import { Static } from 'evm-lite-lib';

import { Store } from 'src/store';
import { PaddedContent } from '../components/Styling';
import { AccountsState } from '../modules/accounts';
import { ApplicationState, setDirectory } from '../modules/application';
import { ConfigurationState } from '../modules/configuration';

import Heading from '../components/Heading';
import Misc from '../classes/Misc';
import Banner from '../components/Banner';

import './styles/Configuration.css';

const Section = styled.div`
	background: #fff !important;
	padding: 30px !important;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.03) !important;
`;

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	accounts: AccountsState;
	app: ApplicationState;
	config: ConfigurationState;
}

interface DispatchProps {
	handleSetDataDirectory: (path: string) => void;
}

interface State {
	selectedFromIndex: number;
	fields: {
		dataDirectory: string;
		keystore: string;
		gas: string;
		gasPrice: string;
		from: string;
	};
}

type LocalProps = StoreProps & AlertProps & DispatchProps;

class Configuration extends React.Component<LocalProps, State> {
	public state = {
		selectedFromIndex: 0,
		fields: {
			dataDirectory: '',
			keystore: '',
			gas: '',
			gasPrice: '',
			from: ''
		}
	};

	public componentDidMount() {
		if (this.props.app.directory) {
			this.setState(
				{
					fields: {
						...this.state.fields,
						dataDirectory: this.props.app.directory
					}
				},
				() => {
					if (this.props.config.data.defaults) {
						const config = this.props.config.data;

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
			);
		}
	}

	public componentWillReceiveProps(nextProps: LocalProps) {
		if (nextProps.app.directory !== this.props.app.directory) {
			this.setState({
				fields: {
					...this.state.fields,
					dataDirectory: nextProps.app.directory
				}
			});
		}

		if (nextProps.config.data.defaults) {
			const config = nextProps.config.data;

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

	public render() {
		const { app, accounts } = this.props;
		const { fields } = this.state;

		const selectAccounts = accounts.all.map((account, i) => {
			return {
				key: account.address.toLowerCase(),
				text: account.address.toLowerCase(),
				value: i
			};
		});

		return (
			<React.Fragment>
				<Heading
					heading={'Configuration'}
					subHeading={app.directory || ''}
				/>
				<Banner color="black">
					These configuration values will be read in by all actions
					across the wallet and other evm-lite applications as default
					values.
				</Banner>
				<br />
				<br />
				<PaddedContent>
					<Header as="h3">
						Data Directory ({app.directory || 'N/A'})
					</Header>
				</PaddedContent>
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
										placeholder={app.directory || 'N/A'}
										onChange={(_, { value }) =>
											this.setState({
												fields: {
													...fields,
													dataDirectory: value
												}
											})
										}
										defaultValue={fields.dataDirectory}
									/>
									<br />
									<Form.Button
										color="blue"
										content="Set"
										onClick={this.handleSetDataDirectory}
									/>
								</Form.Group>
							</div>
						</Section>
					)}
				</Spring>
				<br />
				<br />
				<PaddedContent>
					<Header as="h3">Defaults & Keystore</Header>
				</PaddedContent>
				<br />
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
										<Form.Select
											// selection={true}
											fluid={true}
											placeholder={fields.from}
											options={selectAccounts}
											defaultValue={1}
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
											defaultValue={fields.gasPrice || ''}
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
											placeholder={'Keystore Directory'}
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
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	accounts: store.accounts,
	app: store.app,
	config: store.config
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handleSetDataDirectory: path => dispatch(setDirectory(path))
});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Configuration));
