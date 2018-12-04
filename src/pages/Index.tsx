import * as React from 'react';

import {connect} from "react-redux";
import {Divider, Header, Icon, Message} from "semantic-ui-react";

import {DefaultProps, Store} from "../redux";

import Defaults from "../classes/Defaults";


export interface IndexLocalProps extends DefaultProps {
    currentDataDirectory: string
}

class Index extends React.Component<any, any> {
    public render() {
        const {currentDataDirectory} = this.props;
        return (
            <React.Fragment>
                <Header as='h2'>
                    <Icon name='info circle'/>
                    <Header.Content>
                        Overview
                        <Header.Subheader>Overview of data directory.</Header.Subheader>
                    </Header.Content>
                </Header>
                <Divider/>
                <Message info={true}>
                    <Message.Header>Default Data Directory</Message.Header>
                    <p>
                        This application will be defaulted to data directory in your home folder.
                    </p>
                    <Message.List>
                        <Message.Item><b>Default: </b> {Defaults.dataDirectory}</Message.Item>
                        <Message.Item><b>Current: </b> {currentDataDirectory && currentDataDirectory}</Message.Item>
                    </Message.List>
                </Message>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    currentDataDirectory: store.app.dataDirectory.response
});

const mapsDispatchToProps = (dispatch: any) => ({});

export default connect(mapStoreToProps, mapsDispatchToProps)(Index);