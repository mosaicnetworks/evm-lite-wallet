import * as React from 'react';

import { connect } from 'react-redux';
import { Button, Form, Icon, Message, Modal, TextArea } from 'semantic-ui-react';

import { Store } from '../redux';

interface DispatchProps {
	response?: string;
	error?: string;
	isLoading?: boolean;
}

interface StoreProps {
	empty?: string;
}

interface OwnProps {
	empty?: string;
}

type LocalProps = DispatchProps & StoreProps & OwnProps;

interface State {
	open: boolean;
	v3JSONKeystore: string;
	parseError: string;
}

class AccountImport extends React.Component<LocalProps, State> {
	public state = {
		open: false,
		v3JSONKeystore: '',
		parseError: ''
	};

	public open = () => this.setState({ open: true });
	public close = () => this.setState({ open: false });

	public handleImport = () => {
		// this.setState({ parseError: '' });
		//
		// if (this.state.v3JSONKeystore === '') {
		// 	this.setState({ parseError: 'Account JSON cannot be empty.' });
		// 	return;
		// }
		//
		// this.props.handleImportAccount(this.state.v3JSONKeystore)
		// 	.then(() => {
		// 		if (this.props.response) {
		// 			this.props.alert.success('Account imported!');
		// 		} else {
		// 			this.props.alert.error('Import failed!');
		// 		}
		// 	})
		// 	.then(() => this.close());
	};

	public handleOnChange = (e: any) => {
		const { value } = e.target;

		if (value !== this.state.v3JSONKeystore) {
			this.setState({ v3JSONKeystore: value });
		}
	};

	public render() {
		const { parseError } = this.state;
		const { isLoading, response, error } = this.props;

		return (
			<React.Fragment>
				<Modal
					open={this.state.open}
					onClose={this.close}
					trigger={
						<Button
							content="Import"
							color={'orange'}
							onClick={this.open}
							icon="upload"
							labelPosition="left"
						/>
					}
				>
					<Modal.Header>Import an Account</Modal.Header>
					{(parseError || error) && (
						<Modal.Content>
							<Message icon={true} error={true}>
								<Icon name={'times'}/>
								<Message.Content>
									<Message.Header>
										Oops! {parseError ? parseError : error}
									</Message.Header>
								</Message.Content>
							</Message>
						</Modal.Content>
					)}
					<Modal.Content>
						<Modal.Description>
							<Form>
								<Form.Field>
									<label>v3 JSON Keystore</label>
									<TextArea
										autoHeight={true}
										onChange={this.handleOnChange}
									/>
								</Form.Field>
							</Form>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						{isLoading && !response && (
							<span className={'m-2'}>
								<Icon
									color={'green'}
									name={'circle notch'}
									loading={true}
								/>{' '}
								Importing...
							</span>
						)}
						<Button
							onClick={this.handleImport}
							color={'green'}
							type="submit"
						>
							Import
						</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
	mapStoreToProps,
	mapDispatchToProps
)(AccountImport);
