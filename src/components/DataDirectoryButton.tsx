import * as React from 'react';

import {connect} from "react-redux";
import {Button, Divider, Form, Header, Icon, Label, Modal} from "semantic-ui-react";

import {DefaultProps, Store, DataDirectoryParams, app} from "../redux";


export interface DataDirectoryButtonLocalState extends DefaultProps {
    color: "teal" | "blue";
    dataDirectory: string;
    handleDataDirectoryChange: (data: DataDirectoryParams) =>  void;
}

interface State {
    open: boolean;
    dataDirectory: string;
}

class DataDirectoryButton extends React.Component<DataDirectoryButtonLocalState, State> {
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
        this.props.handleDataDirectoryChange({path: this.state.dataDirectory});
    };

    public render() {
        return (
            <Modal
                trigger={<Button icon={true} color={this.props.color} basic={false}> <Icon name={"folder"}/></Button>}>
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
                    <Button color={"green"} onClick={this.handleOnSubmit} type='submit'>Set</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    dataDirectory: store.app.dataDirectory.response
});

const mapDispatchToProps = (dispatch: any) => ({
    handleDataDirectoryChange: (data: DataDirectoryParams) => dispatch(app.handleDataDirectoryInit(data)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(DataDirectoryButton);