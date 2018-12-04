import * as React from 'react';

import {connect} from "react-redux";
import {Button, Form, Message, Modal} from "semantic-ui-react";

import {Account} from 'evm-lite-lib';

import {accounts, BaseAccount, DefaultProps, keystore, Store, ConfigSchema} from "../../redux";
import {TransferParams} from "../../redux/actions/Accounts";

export interface LocalAccountTransferProps extends DefaultProps {
    account: BaseAccount;
    handleTransfer: (data: TransferParams) => void;
    config: ConfigSchema;
}

interface State {
    open: boolean;
    toAddress: string;
    value: string;
    gas: string;
    password: string;
    gasPrice: string;
    decryptionError: string;
}

class AccountTransfer extends React.Component<LocalAccountTransferProps, any & State> {
    public state = {
        open: false,
        toAddress: '',
        value: '',
        gas: '',
        gasPrice: '',
        password: '',
        decryptionError: ''
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

    public handlePasswordChange = (e: any) => {
        this.setState({password: e.target.value});
    };

    public onBlurPassword = (e: any) => {
        this.setState({decryptionError: ''});
        const v3JSONKeystore = keystore.keystore.get(this.props.account.address);
        try {
            Account.decrypt(v3JSONKeystore, this.state.password)
        } catch (e) {
            console.log('error');
            this.setState({decryptionError: 'Unable to decrypt account with password provided.'})
        }
    };

    public handleTransfer = () => {
        const tx = {
            from: this.props.account.address,
            to: this.state.toAddress,
            value: this.state.value,
            gas: this.state.gas,
            gasprice: this.state.gasPrice
        };
        const data: TransferParams = {
            tx,
            password: this.state.password
        };

        this.props.handleTransfer(data);
        console.log(this.state);
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
                                    <label>Password</label>
                                    <input type={"password"} onChange={this.handlePasswordChange} onBlur={this.onBlurPassword}/>
                                </Form.Field>
                                {this.state.decryptionError && (<Message info={true}>
                                    <Message.Header>An error was detected</Message.Header>
                                    <p>{this.state.decryptionError}</p>
                                </Message>)}
                                <Form.Group widths={"two"}>
                                    <Form.Field>
                                        <label>To</label>
                                        <input onChange={this.handleOnChangeToAddress}/>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Value</label>
                                        <input defaultValue={"0"} onChange={this.handleOnChangeValue}/>
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths={"two"}>
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
                                </Form.Group>
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
    config: store.config.read.response,
});

const mapDispatchToProps = (dispatch: any) => ({
    handleTransfer: (data: TransferParams) => dispatch(accounts.handleTransfer(data)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountTransfer);