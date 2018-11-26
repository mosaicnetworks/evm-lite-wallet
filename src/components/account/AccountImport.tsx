import * as React from 'react';

import {connect} from "react-redux";
import {Button, Form, Icon, Modal, TextArea} from "semantic-ui-react";

import {DefaultProps, Store} from "../../redux";


export interface LocalAccountsEditProps extends DefaultProps {
    error: string;
}

interface State {
    open: boolean;
}

class AccountImport extends React.Component<LocalAccountsEditProps, any & State> {
    public state = {
        open: false,
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleImport = () => {
        // export
    };

    public render() {
        return (
            <React.Fragment>
                <Modal trigger={<Button basic={false} color={"orange"}><Icon name="upload" />Import</Button>}>
                    <Modal.Header>Import an Account</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>v3 JSON Keystore</label>
                                    <TextArea autoHeight={true}/>
                                </Form.Field>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleImport} color={"green"} type='submit'>Import</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountImport);