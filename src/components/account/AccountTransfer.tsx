import * as React from 'react';

import {connect} from "react-redux";
import {Button, Form, Icon, Message, Modal} from "semantic-ui-react";

import {accounts, BaseAccount, ConfigSchema, DefaultProps, keystore, Store} from "../../redux";
import {DecryptionParams, TransferParams} from "../../redux/actions/Accounts";

export interface LocalAccountTransferProps extends DefaultProps {
    account: BaseAccount;
    handleTransfer: (data: TransferParams) => void;
    handleDecryption: (data: DecryptionParams) => void;
    config: ConfigSchema;
    decrypt: {
        response: string,
        error: string,
        isLoading: boolean
    }
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
        if (!this.props.decrypt.response) {
            const v3JSONKeystore = keystore.keystore.get(this.props.account.address);
            this.props.handleDecryption({
                v3JSONKeystore,
                password: this.state.password
            })
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

    public getDecryptIcon = (): ('circle notched' | 'info circle' | 'times' | 'thumbs up') => {
        const {decrypt} = this.props;
        let icon: ('circle notched' | 'info circle' | 'times' | 'thumbs up') = decrypt.isLoading ? 'circle notched' : 'info circle';

        if (!decrypt.isLoading && decrypt.response) {
            icon = 'thumbs up'
        }

        if (!decrypt.isLoading && decrypt.error) {
            icon = 'times'
        }

        return icon
    };

    public getDecryptMessage = () => {
        const {decrypt} = this.props;
        let header = decrypt.isLoading ? 'Decrypting...' :
            'Password is required to decrypt the account before a transfer.';
        let message = decrypt.isLoading ? 'Please wait while we try to decrypt the account' :
            `Please enter the password for the account: ${this.props.account.address}`;

        if (!decrypt.isLoading && decrypt.response) {
            header = 'Decryption Successful';
            message = 'The account was successfully decrypted with the password provided!';
        }

        if (!decrypt.isLoading && decrypt.error) {
            header = 'Decryption Failed';
            message = 'The account was could not be decrypted with the password provided!';
        }

        return {
            header,
            message
        }
    };

    public render() {
        const {config, decrypt} = this.props;
        const decryptMessage = this.getDecryptMessage();
        return (
            <React.Fragment>
                <Modal trigger={<Button basic={false} color='green'>Transfer</Button>}>
                    <Modal.Header>Transfer From: {this.props.account.address}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>Password</label>
                                    <input type={"password"} onChange={this.handlePasswordChange}
                                           onBlur={this.onBlurPassword}/>
                                </Form.Field>
                                <Message icon={true} info={decrypt.isLoading} negative={!!(decrypt.error)}
                                         positive={!!(decrypt.response)}>
                                    <Icon name={this.getDecryptIcon()} loading={decrypt.isLoading}/>
                                    <Message.Content>
                                        <Message.Header>
                                            {decryptMessage.header}
                                        </Message.Header>
                                        <p>{decryptMessage.message}</p>
                                    </Message.Content>
                                </Message>
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
    decrypt: store.accounts.decrypt
});

const mapDispatchToProps = (dispatch: any) => ({
    handleTransfer: (data: TransferParams) => dispatch(accounts.handleTransfer(data)),
    handleDecryption: (data: DecryptionParams) => dispatch(accounts.handleDecryption(data))
});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountTransfer);