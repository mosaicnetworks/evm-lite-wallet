import * as React from 'react';

import {connect} from "react-redux";
import {Button, Divider, Form, Header, Icon, Label, Message, Modal} from "semantic-ui-react";

import {BaseAccount} from 'evml-cli';

import {AccountsActions, DefaultProps, Store} from "evml-redux";

import './styles/Account.css'


export interface LocalAccountsEditProps extends DefaultProps {
    handleUpdatePassword: (a: string, o: string, n: string) => void;
    error: string;
    response: string;
    account: BaseAccount;
    isLoading: boolean;
}

interface State {
    open: boolean;
    oldPassword: string;
    newPassword: string;
    verifyNewPassword: string;
    matchingPasswordError: string;
}

class AccountUpdate extends React.Component<LocalAccountsEditProps, any & State> {
    public state = {
        open: false,
        oldPassword: '',
        verifyNewPassword: '',
        newPassword: '',
        matchingPasswordError: ''
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleSave = () => {
        this.setState({matchingPasswordError: ''});

        const {oldPassword, newPassword, verifyNewPassword} = this.state;

        if (!newPassword && !verifyNewPassword) {
            this.setState({matchingPasswordError: 'The fields cannot be empty!'});
            return;
        }

        if (newPassword !== verifyNewPassword) {
            this.setState({matchingPasswordError: 'New password & verify password must match!'});
        } else {
            this.props.handleUpdatePassword(this.props.account.address, oldPassword, newPassword);
        }
    };

    public render() {
        const {isLoading, error, response} = this.props;
        return (
            <React.Fragment>
                <Modal trigger={<Button basic={false} color='yellow'>Change Password</Button>}>
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
                            <Label.Detail>/Users/danu/.evmlc/keystore</Label.Detail>
                        </Label><br/><br/>
                        <Divider/>
                        {(this.state.matchingPasswordError || error) && (<Modal.Content>
                            <Message icon={true} error={true}>
                                <Icon name={"times"}/>
                                <Message.Content>
                                    <Message.Header>
                                        Oops! {this.state.matchingPasswordError ? this.state.matchingPasswordError : error}
                                    </Message.Header>
                                </Message.Content>
                            </Message>
                        </Modal.Content>)}
                        {!isLoading && response && (<Modal.Content>
                            <Message icon={true} success={true}>
                                <Icon name={"thumbs up"}/>
                                <Message.Content>
                                    <Message.Header>
                                        Success! {response}
                                    </Message.Header>
                                </Message.Content>
                            </Message>
                        </Modal.Content>)}<br/>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>Old Password: </label>
                                    <input type={"password"} placeholder='Old Password'
                                           onChange={(e) => this.setState({oldPassword: e.target.value})}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>New Password</label>
                                    <input type={"password"} placeholder='New Password'
                                           onChange={(e) => this.setState({newPassword: e.target.value})}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Verify New Password</label>
                                    <input type={"password"} placeholder='Verify New Password'
                                           onChange={(e) => this.setState({verifyNewPassword: e.target.value})}
                                    />
                                </Form.Field>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        {isLoading && !response &&
                        (<span className={"m-2"}>
                            <Icon color={"green"} name={"circle notch"} loading={true}/> Saving...
                        </span>)}
                        <Button onClick={this.handleSave} color={"green"} type='submit'>Update</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    isLoading: store.accounts.updateAccount.isLoading,
    error: store.accounts.updateAccount.updateAccountError,
    response: store.accounts.updateAccount.updateAccountResponse
});

const mapDispatchToProps = (dispatch: any) => ({
    handleUpdatePassword: (a: string, o: string, n: string) => {
        return dispatch(AccountsActions.handleUpdateAccountPassword(a, o, n));
    }
});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountUpdate);