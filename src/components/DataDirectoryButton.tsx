import * as React from 'react';

import {withAlert} from 'react-alert';
import {connect} from "react-redux";
import {Button, Divider, Form, Header, Icon, Label, Modal} from "semantic-ui-react";

import {app, BaseAccount, DataDirectoryParams, DefaultProps, Store} from "../redux";


export interface DataDirectoryButtonLocalProps extends DefaultProps {
    color: "teal" | "blue";

    // redux states
    dataDirectory: string;

    // thunk action handlers
    handleDataDirectoryChange: (data: DataDirectoryParams) => Promise<BaseAccount[]>;
}

interface State {
    open: boolean;
    dataDirectory: string;
}

class DataDirectoryButton extends React.Component<DataDirectoryButtonLocalProps, State> {
    public state = {
        open: false,
        dataDirectory: "/Users/danu/.evmlc/",
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleOnChangeDataDirectory = (e: any) => {
        this.setState({dataDirectory: e.target.value})
    };

    public handleOnSubmit = () => {
        this.props.handleDataDirectoryChange({path: this.state.dataDirectory})
            .then(() => {
                this.close();
                this.props.alert.success('Data directory successfully changed!');
                if (this.props.accounts) {
                    this.props.alert.success('Accounts reloaded!');
                } else {
                    this.props.alert.error('No Accounts detected!');
                }
            })
    };

    public render() {
        return (
            <Modal
                trigger={<Button icon={true} onClick={this.open} color={this.props.color} basic={false}><Icon
                    name={"folder"}/></Button>} open={this.state.open} onClose={this.close}>
                <Modal.Header>Change Data Directory</Modal.Header>
                <Modal.Content>
                    <Header as={"h4"}>
                        Information
                    </Header>
                    The data directory specifies a root directory for your keystore and config file. Changing this to a
                    directory with
                    no keystore folder or config file will automatically generate them.
                    <br/><br/>
                    <Label>
                        Data Directory
                        <Label.Detail>{this.props.dataDirectory}</Label.Detail>
                    </Label><br/><br/>
                    <Divider/>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <label>Data Directory</label>
                                <input onChange={this.handleOnChangeDataDirectory}
                                       defaultValue={this.props.dataDirectory}/>
                            </Form.Field>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close}>Close</Button>
                    <Button color={"green"} disabled={(this.props.dataDirectory === this.state.dataDirectory)}
                            onClick={this.handleOnSubmit} type='submit'>Set</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    dataDirectory: store.app.dataDirectory.response,
    accounts: store.keystore.fetch.response
});

const mapDispatchToProps = (dispatch: any) => ({
    handleDataDirectoryChange: (data: DataDirectoryParams) => dispatch(app.handleDataDirInitThenPopulateApp(data)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(withAlert(DataDirectoryButton));