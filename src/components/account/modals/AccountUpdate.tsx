import * as React from 'react';

import {InjectedAlertProp, withAlert} from "react-alert";
import {connect} from "react-redux";
import {Button, Divider, Form, Header, Label, Modal} from "semantic-ui-react";
import {V3JSONKeyStore} from 'evm-lite-lib';

import {BaseAccount, ConfigSchema, Store} from "../../../redux";

import '../styles/Account.css'

interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    error?: string | null;
    response?: string | null;
    isLoading?: boolean;
    config?: ConfigSchema | null
    decryption?: any
}

interface DispatchProps {
    empty?: null;
    // handleUpdatePassword: (a: string, o: string, n: string) => Promise<BaseAccount[]>;
    // handleUpdateReset: () => void;
    // handleDecryptionReset: () => void;
    // handleDecryption: (data: DecryptionParams) => Promise<string>;
}

interface OwnProps {
    account: BaseAccount;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps

interface State {
    open: boolean;
    oldPassword: string;
    newPassword: string;
    verifyNewPassword: string;
    v3JSONKeystore: V3JSONKeyStore;
    updateDisable: boolean;
    matchingPasswordError: string;
}

class AccountUpdate extends React.Component<LocalProps, any & State> {
    public state = {
        open: false,
        oldPassword: '',
        verifyNewPassword: '',
        newPassword: '',
        matchingPasswordError: '',
        v3JSONKeystore: {},
        updateDisable: true
    };

    public open = () => this.setState({open: true});
    public close = () => {
        // if (this.props.decryption.response || this.props.decryption.error) {
        //     this.props.handleDecryptionReset();
        // }
        //
        // if (this.props.response || this.props.error) {
        //     this.props.handleUpdateReset();
        // }

        this.setState({open: false});
    };

    public handleSave = () => {
        // this.setState({matchingPasswordError: ''});
        //
        // const {oldPassword, newPassword, verifyNewPassword} = this.state;
        //
        // if (!newPassword && !verifyNewPassword) {
        //     this.setState({matchingPasswordError: 'The fields cannot be empty!'});
        //     return;
        // }
        //
        // if (newPassword !== verifyNewPassword) {
        //     this.setState({matchingPasswordError: 'New password & verify password must match!'});
        // } else {
        // this.props.handleUpdatePassword(this.props.account.address, oldPassword, newPassword)
        //     .then(() => {
        //         if (this.props.response) {
        //             this.props.alert.success('Account password successfully updated!');
        //         } else {
        //             this.props.alert.error(this.props.error || "");
        //         }
        //     })
        //     .then(() => {
        //         this.close();
        //     })
        // }
    };

    public handleChangeOldPassword = (e: any) => {
        this.setState({oldPassword: e.target.value});
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

    public handleChangeNewPassword = (e: any) => {
        this.setState({newPassword: e.target.value});
    };

    public handleChangeVerifyNewPassword = (e: any) => {
        this.setState({verifyNewPassword: e.target.value});
    };

    public onBlurPassword = async () => {
        // if (!this.props.decryption.response) {
        //     this.props.handleDecryption({
        //         v3JSONKeystore: await keystore.keystore.get(this.props.account.address),
        //         password: this.state.oldPassword
        //     })
        //         .then(() => {
        //             if (this.props.decryption.response) {
        //                 this.setState({updateDisable: false})
        //             }
        //         })
        // }
    };

    public render() {
        // const {isLoading, error, config, decryption} = this.props;
        // const decryptMessage = this.getMessageHeaderAndContent();
        return (
            <React.Fragment>
                <Modal open={this.state.open} onClose={this.close}
                       trigger={<Button basic={false} onClick={this.open} color='yellow'>Change Password</Button>}>
                    <Modal.Header>Update: {this.props.account.address}</Modal.Header>
                    <Modal.Content>
                        <Header as={"h4"}>
                            Information
                        </Header>
                        Account will be encrypted with the new password and the current v3JSONKeystore file will be
                        overwritten with the new JSON data.
                        <br/><br/>
                        <Label>
                            Keystore
                            {/*<Label.Detail>{config && config.storage.keystore}</Label.Detail>*/}
                        </Label><br/><br/>
                        <Divider/>
                        {/*{(this.state.matchingPasswordError || error) && (<Modal.Content>*/}
                        {/*<Message icon={true} error={true}>*/}
                        {/*<Icon name={"times"}/>*/}
                        {/*<Message.Content>*/}
                        {/*<Message.Header>*/}
                        {/*Oops! {this.state.matchingPasswordError ? this.state.matchingPasswordError : error}*/}
                        {/*</Message.Header>*/}
                        {/*</Message.Content>*/}
                        {/*</Message>*/}
                        {/*</Modal.Content>)}*/}
                        <br/>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>Old Password: </label>
                                    <input onBlur={this.onBlurPassword} type={"password"} placeholder='Old Password'
                                           onChange={this.handleChangeOldPassword}/>
                                </Form.Field>
                                {/*<Message icon={true} info={decryption.isLoading} negative={!!(decryption.error)}*/}
                                {/*positive={!!(decryption.response)}>*/}
                                {/*<Icon name={this.getDecryptIcon()} loading={decryption.isLoading}/>*/}
                                {/*<Message.Content>*/}
                                {/*<Message.Header>*/}
                                {/*{decryptMessage.header}*/}
                                {/*</Message.Header>*/}
                                {/*<p>{decryptMessage.message}</p>*/}
                                {/*</Message.Content>*/}
                                {/*</Message>*/}
                                <Form.Field>
                                    <label>New Password</label>
                                    <input type={"password"} placeholder='New Password'
                                           onChange={this.handleChangeNewPassword}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Verify New Password</label>
                                    <input type={"password"} placeholder='Verify New Password'
                                           onChange={this.handleChangeVerifyNewPassword}
                                    />
                                </Form.Field>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        {/*{isLoading && (<span className={"m-2"}>*/}
                        {/*<Icon color={"green"} name={"circle notch"} loading={true}/>*/}
                        {/*Saving...*/}
                        {/*</span>)}*/}
                        <Button onClick={this.close}>Close</Button>
                        <Button disabled={this.state.updateDisable} onClick={this.handleSave} color={"green"}
                                type='submit'>Update</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store): StoreProps => ({});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    // handleUpdatePassword: (a: string, o: string, n: string) => {
    //     return dispatch(keystore.handleUpdateThenFetch({
    //         newPassword: n,
    //         oldPassword: o,
    //         address: a,
    //     }));
    // },
    // handleUpdateReset: () => dispatch(keystore.handlers<string, string>('Update').reset()),
    // handleDecryptionReset: () => dispatch(accounts.handlers<string, string>('Decrypt').reset()),
    // handleDecryption: (data: DecryptionParams) => dispatch(accounts.handleDecryption(data)),
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapDispatchToProps
)(withAlert<AlertProps>(AccountUpdate));