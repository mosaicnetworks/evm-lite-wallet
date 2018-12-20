import * as React from 'react';

import {InjectedAlertProp, withAlert} from 'react-alert';
import {connect} from "react-redux";
import {Button, Divider, Form, Header, Icon, Label, Modal} from "semantic-ui-react";

import {app, Store} from "../redux";
import {DataDirectoryAppReducer} from "../redux/reducers/Application";

import Defaults from "../classes/Defaults";


interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    dataDirectoryTask: DataDirectoryAppReducer;
    connectivityError: string | null;
}

interface DispatchProps {
    handleDataDirectoryChangeInit: (directory: string) => void;
}

interface OwnProps {
    color: "teal" | "blue";
}

interface State {
    open: boolean;
    fields: {
        dataDirectory: string;
    }
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;

class DataDirectoryButton extends React.Component<LocalProps, State> {
    public state = {
        open: false,
        fields: {
            dataDirectory: this.props.dataDirectoryTask.payload || Defaults.dataDirectory,
        }
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleOnChangeDataDirectory = (e: any) => {
        this.setState({
            fields: {
                dataDirectory: e.target.value,
            }
        })
    };

    public handleOnSubmit = async () => {
        await this.props.handleDataDirectoryChangeInit(this.state.fields.dataDirectory);

        if (this.props.connectivityError) {
            this.props.alert.error(
                'A connection to a node could not be established. ' +
                'Please update the configuration' +
                ' file with the correct host and port.'
            );
        }
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
                        <Label.Detail>{this.state.fields.dataDirectory}</Label.Detail>
                    </Label><br/><br/>
                    <Divider/>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <label>Data Directory</label>
                                <input onChange={this.handleOnChangeDataDirectory}
                                       defaultValue={this.props.dataDirectoryTask.payload
                                       || this.state.fields.dataDirectory}/>
                            </Form.Field>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close}>Close</Button>
                    <Button color={"green"}
                            disabled={(this.props.dataDirectoryTask.payload === this.state.fields.dataDirectory)}
                            onClick={this.handleOnSubmit} type='submit'>Set</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStoreToProps = (store: Store): StoreProps => ({
    dataDirectoryTask: store.app.directory,
    connectivityError: store.app.connectivity.error,
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    handleDataDirectoryChangeInit: (directory: string) => dispatch(app.handlers.directory.init(directory)),
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapDispatchToProps
)(withAlert<AlertProps>(DataDirectoryButton));