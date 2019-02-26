import * as React from 'react';

import { connect } from 'react-redux';
import { Divider, Header, Icon, Message } from 'semantic-ui-react';

import { Store } from '../redux';

import Defaults from '../classes/Defaults';

interface StoreProps {
	currentDataDirectory: string | null;
}

type LocalProps = StoreProps;

class Index extends React.Component<LocalProps, any> {
	public render() {
		const { currentDataDirectory } = this.props;
		return (
			<React.Fragment>
				<div className={'page-left-right-padding'}>
					<Header as="h2">
						<Icon name="info circle" />
						<Header.Content>
							Overview
							<Header.Subheader>
								Overview of data directory.
							</Header.Subheader>
						</Header.Content>
					</Header>
					<Divider />
					<Message info={true}>
						<Message.Header>Default Data Directory</Message.Header>
						<p>
							This application will be defaulted to data directory
							in your home folder.
						</p>
						<Message.List>
							<Message.Item>
								<b>Default: </b> {Defaults.dataDirectory}
							</Message.Item>
							<Message.Item>
								<b>Current: </b> {currentDataDirectory || ''}
							</Message.Item>
						</Message.List>
					</Message>
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	currentDataDirectory: store.app.directory.payload
});

const mapsDispatchToProps = (dispatch: any) => ({});

export default connect<StoreProps, {}, {}, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(Index);
