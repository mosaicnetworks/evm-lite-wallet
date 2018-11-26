import * as React from 'react';

import {connect} from "react-redux";
import {Button, Modal, Form} from "semantic-ui-react";

import {DefaultProps, Store, BaseAccount} from "evml-redux";


export interface LocalAccountsEditProps extends DefaultProps {
    account: BaseAccount
}

interface State {
    open: boolean;
}

class AccountTransfer extends React.Component<LocalAccountsEditProps, any & State> {
    public state = {
        open: false,
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleTransfer = () => {
        // pass
    };

    public render() {
        const {config} = this.props;
        return (
            <React.Fragment>
                <Modal trigger={<Button basic={false} color='green'>Transfer</Button>}>
                    <Modal.Header>Transfer From: {this.props.account.address}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>To</label>
                                    <input/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Value</label>
                                    <input/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Gas</label>
                                    <input defaultValue={config && config.defaults.gas}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Gas Price</label>
                                    <input defaultValue={config && config.defaults.gasprice}/>
                                </Form.Field>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleTransfer} color={"green"} type='submit'>Transfer</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    config: store.config.readConfig.readConfigResponse
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountTransfer);