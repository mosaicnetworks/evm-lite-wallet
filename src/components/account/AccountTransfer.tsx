import * as React from 'react';

import {connect} from "react-redux";
import {InjectedAlertProp, withAlert} from "react-alert";
import {Button, Form, Icon, Message, Modal} from "semantic-ui-react";
import {V3JSONKeyStore} from 'evm-lite-lib';

import {accounts, BaseAccount, ConfigSchema, configuration, keystore, Store} from "../../redux";
import {DecryptionParams, TransferParams} from "../../redux/actions/Accounts";
import {ReadConfigReducer} from "../../redux/reducers/Configuration";
import {DecryptAccountsReducer} from "../../redux/reducers/Accounts";


interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    config: ReadConfigReducer;
    decryption: DecryptAccountsReducer
}

interface DispatchProps {
    handleTransfer: (data: TransferParams) => Promise<void>;
    handleDecryption: (data: DecryptionParams) => Promise<string>;
    handleDecryptionReset: () => void;
    handleReadConfig: () => Promise<ConfigSchema>;
}

interface OwnProps {
    account: BaseAccount;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps

interface State {
    open: boolean;
    toAddress: string;
    value: string;
    gas: string;
    password: string;
    gasPrice: string;
    decryptionError: string;
    v3JSONKeystore: V3JSONKeyStore;
    transferDisable: boolean;
}

class AccountTransfer extends React.Component<LocalProps, any & State> {
    public state = {
        open: false,
        toAddress: '',
        value: '',
        gas: '',
        gasPrice: '',
        password: '',
        decryptionError: '',
        v3JSONKeystore: keystore.keystore.get(this.props.account.address),
        transferDisable: true,
    };

    public componentDidMount = () => {
        const {response} = this.props.config;
        if (response) {
            this.setVars(response)
        } else {
            this.handleReadConfig();
        }
    };

    public handleReadConfig = () => {
        this.props.handleReadConfig()
            .then((config) => this.setVars(config));
    };

    public open = () => this.setState({open: true});
    public close = () => {
        if (this.props.decryption.response || this.props.decryption.error) {
            this.props.handleDecryptionReset();
        }
        this.setState({open: false});
    };

    public setVars(response: any) {
        const gasPrice: string = response.defaults.gasprice || '0';
        this.setState({
            gas: response.defaults.gas,
            gasprice: gasPrice,
        });
    }

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

    public onBlurPassword = async () => {
        if (!this.props.decryption.response) {
            this.props.handleDecryption({
                v3JSONKeystore: await this.state.v3JSONKeystore,
                password: this.state.password
            })
                .then(() => {
                    if (this.props.decryption.response) {
                        this.setState({transferDisable: false})
                    }
                })
        }
    };

    public handleTransfer = async () => {
        const tx = {
            from: this.props.account.address,
            to: this.state.toAddress,
            value: this.state.value,
            gas: this.state.gas,
            gasprice: this.state.gasPrice,
            nonce: this.props.account.nonce
        };
        const data: TransferParams = {
            tx,
            password: this.state.password,
            v3JSONKeystore: await this.state.v3JSONKeystore,
        };

        if (this.props.decryption.response) {
            this.props.handleTransfer(data)
                .then(() => {
                    this.props.alert.success('Transaction submitted!');
                })
                .catch(() => {
                    this.props.alert.error('Error transacting!');
                });

            this.close();
        }
    };

    public getDecryptIcon = (): ('circle notched' | 'info circle' | 'times' | 'thumbs up') => {
        const {decryption} = this.props;
        let icon: ('circle notched' | 'info circle' | 'times' | 'thumbs up') = decryption.isLoading ? 'circle notched' : 'info circle';

        if (!decryption.isLoading && decryption.response) {
            icon = 'thumbs up'
        }

        if (!decryption.isLoading && decryption.error) {
            icon = 'times'
        }

        return icon
    };

    public getMessageHeaderAndContent = () => {
        const {decryption} = this.props;
        let header = decryption.isLoading ? 'Decrypting...' :
            'Password is required to decryption the account before a transfer.';
        let message = decryption.isLoading ? 'Please wait while we try to decryption the account' :
            `Please enter the password for the account: ${this.props.account.address}`;

        if (!decryption.isLoading && decryption.response) {
            header = 'Decryption Successful';
            message = 'The account was successfully decrypted with the password provided!';
        }

        if (!decryption.isLoading && decryption.error) {
            header = 'Decryption Failed';
            message = 'The account was could not be decrypted with the password provided!';
        }

        return {
            header,
            message
        }
    };

    public render() {
        const {decryption} = this.props;
        const decryptMessage = this.getMessageHeaderAndContent();
        return (
            <React.Fragment>
                <Modal onClose={this.close} open={this.state.open}
                       trigger={<Button onClick={this.open} basic={false} color='green'>Transfer</Button>}>
                    <Modal.Header>Transfer From: {this.props.account.address}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>Password</label>
                                    <input type={"password"} onChange={this.handlePasswordChange}
                                           onBlur={this.onBlurPassword}/>
                                </Form.Field>
                                <Message icon={true} info={decryption.isLoading} negative={!!(decryption.error)}
                                         positive={!!(decryption.response)}>
                                    <Icon name={this.getDecryptIcon()} loading={decryption.isLoading}/>
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
                                               defaultValue={this.state.gas}/>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Gas Price</label>
                                        <input onChange={this.handleOnChangeGasPrice}
                                               defaultValue={this.state.gasPrice}/>
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close}>Close</Button>
                        <Button disabled={this.state.transferDisable} onClick={this.handleTransfer} color={"green"}
                                type='submit'>Transfer</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store): StoreProps => ({
    config: store.config.read,
    decryption: store.accounts.decrypt
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    handleTransfer: (data: TransferParams) => dispatch(accounts.handleTransfer(data)),
    handleReadConfig: () => dispatch(configuration.handleRead()),
    handleDecryption: (data: DecryptionParams) => dispatch(accounts.handleDecryption(data)),
    handleDecryptionReset: () => dispatch(accounts.handlers<string, string>('Decrypt').reset())
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapDispatchToProps
)(withAlert<AlertProps>(AccountTransfer));