import * as React from 'react';

import {connect} from "react-redux";
import {Button, Form, Modal} from "semantic-ui-react";

import {BaseAccount, DefaultProps, Store} from "evml-redux";


export interface LocalAccountsEditProps extends DefaultProps {
    account: BaseAccount
}

interface State {
    open: boolean;
    toAddress: string;
    value: string;
    gas: string;
    gasPrice: string;
}

class AccountTransfer extends React.Component<LocalAccountsEditProps, any & State> {
    public state = {
        open: false,
        toAddress: '',
        value: '',
        gas: '',
        gasPrice: '',
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleOnChangeToAddress = (e: any) => {
        this.setState({toAddress: e.target.value});
    };

    public handleOnChangeValue = (e: any) => {
        this.setState({value: e.target.value});
    };

    public handleOnChangeGas = (e: any) => {
        this.setState({gas: e.target.value});
    };

    public handleOnChangeGasPrice = (e: any) => {
        this.setState({gasPrice: e.target.value});
    };

    public handleTransfer = () => {
        console.log(this.state);
    };

    public render() {
        console.log('render');
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
                                    <input onChange={this.handleOnChangeToAddress}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Value</label>
                                    <input onChange={this.handleOnChangeValue}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Gas</label>
                                    <input onChange={this.handleOnChangeGas}
                                           defaultValue={config && config.defaults.gas}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Gas Price</label>
                                    <input onChange={this.handleOnChangeGasPrice}
                                        defaultValue={config && config.defaults.gasprice}/>
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