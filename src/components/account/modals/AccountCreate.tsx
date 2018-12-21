import * as React from 'react';

import {connect} from "react-redux";
import {InjectedAlertProp, withAlert} from "react-alert";
import {Button, Divider, Form, Header, Icon, Label, Message, Modal} from "semantic-ui-react";

import {ConfigSchema, EVMLDispatch, Store} from "../../../redux";


interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    isLoading?: boolean;
    response?: string | null;
    error?: string | null;
    config?: ConfigSchema | null;
}

interface DispatchProps {
    empty?: null;
}

interface OwnProps {
    empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps

interface State {
    open: boolean;
    password: string;
    verifyPassword: string;
    errorState: string;
}

class AccountCreate extends React.Component<LocalProps, any & State> {
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

    public handleCreate = async () => {
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

        this.close();

        // await this.props.handleCreateAccount(password);

        if (this.props.response) {
            this.props.alert.success('Account created!');
        } else {
            this.props.alert.error('Error: ' + this.props.error);
        }
    };

    public render() {
        const {errorState} = this.state;
        const {isLoading, config} = this.props;
        return (
            <React.Fragment>
                <Modal open={this.state.open}
                       onClose={this.close}
                       trigger={
                           <Button content='Create' color={"green"} icon='plus'
                                   onClick={this.open}
                                   labelPosition='left' />
                       }>
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
                            <Label.Detail>{config && config.storage.keystore}</Label.Detail>
                        </Label><br/><br/>
                        <Divider/>
                        {!isLoading && (errorState) && (<Modal.Content>
                            <Message icon={true} error={true}>
                                <Icon name={"times"}/>
                                <Message.Content>
                                    <Message.Header>
                                        Oops! {errorState}
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
                        <Button onClick={this.close}>Close</Button>
                        {isLoading && (<span className={"m-2"}>
                            <Icon color={"green"} name={"circle notch"} loading={true}/> Creating...</span>)}
                        <Button onClick={this.handleCreate} color={"green"} type='submit'>Create</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store): StoreProps => ({
});

const mapDispatchToProps = (dispatch: EVMLDispatch<string, string>): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapDispatchToProps
)(withAlert<AlertProps>(AccountCreate));