import * as React from 'react';

import {connect} from "react-redux";
import {Button, Divider, Form, Header, Icon, Label, Message, Modal} from "semantic-ui-react";

import {accounts, DefaultProps, Store, EVMLDispatch} from "../../redux";

export interface LocalAccountsEditProps extends DefaultProps {
    handleCreateAccount: (password: string) => void;
    isLoading: boolean;
    response: string;
    error: string
}

interface State {
    open: boolean;
    password: string;
    verifyPassword: string;
    errorState: string;
}

class AccountCreate extends React.Component<LocalAccountsEditProps, any & State> {
    public state = {
        open: false,
        password: '',
        verifyPassword: '',
        errorState: ''
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleChangeVerifyPassword = (e: any) => {
        this.setState({password: e.target.value});
    };

    public handleChangePassword = (e: any) => {
        this.setState({verifyPassword: e.target.value});
    };

    public handleCreate = () => {
        this.setState({errorState: ''});

        const {password, verifyPassword} = this.state;

        if (!password || !verifyPassword) {
            this.setState({errorState: 'Fields must not be empty!'});
            return;
        }
        if (password !== verifyPassword) {
            this.setState({errorState: 'Password do not match!'});
            return;
        }

        this.props.handleCreateAccount(password);
    };

    public render() {
        const {errorState} = this.state;
        const {error, isLoading, response} = this.props;
        return (
            <React.Fragment>
                <Modal trigger={<Button color={"green"} basic={false}><Icon name="plus"/>Create</Button>}>
                    <Modal.Header>Create an Account</Modal.Header>
                    <Modal.Content>
                        <Header as={"h4"}>
                            Information
                        </Header>
                        Enter a password to encrypt your account. The created account will be placed in the keystore
                        directory specified in the configuration tab. If you would like to create the account in a
                        different
                        directory, update the configuration for keystore. <br/><br/>
                        <Label>
                            Keystore
                            <Label.Detail>/Users/danu/.evmlc/keystore</Label.Detail>
                        </Label><br/><br/>
                        <Divider/>
                        {!isLoading && (errorState || error) && (<Modal.Content>
                            <Message icon={true} error={true}>
                                <Icon name={"times"}/>
                                <Message.Content>
                                    <Message.Header>
                                        Oops! {errorState ? errorState : error}
                                    </Message.Header>
                                </Message.Content>
                            </Message>
                        </Modal.Content>)}
                        {!isLoading && response && (<Modal.Content>
                            <Message icon={true} success={true}>
                                <Icon name={"thumbs up"}/>
                                <Message.Content>
                                    <Message.Header>
                                        Success! Address: {JSON.parse(response).address.toUpperCase()}
                                    </Message.Header>
                                </Message.Content>
                            </Message>
                        </Modal.Content>)}<br/>
                        <Modal.Description>
                            <Form>
                                <Form.Field>
                                    <label>Password: </label>
                                    <input onChange={this.handleChangePassword}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Verify Password: </label>
                                    <input onChange={this.handleChangeVerifyPassword}/>
                                </Form.Field>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        {isLoading && (<span className={"m-2"}>
                            <Icon color={"green"} name={"circle notch"} loading={true}/> Creating...</span>)}
                        <Button onClick={this.handleCreate} color={"green"} type='submit'>Create</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    ...store.accounts.create
});

const mapDispatchToProps = (dispatch: EVMLDispatch<string, string>) => ({
    handleCreateAccount: (password: string) => dispatch(accounts.handleCreateAccount(password)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountCreate);