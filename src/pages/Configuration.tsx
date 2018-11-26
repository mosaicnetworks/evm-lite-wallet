import * as React from 'react';

import {connect} from "react-redux";

import {Button, Divider, Form, Header, Icon, Label} from "semantic-ui-react";

import {DefaultProps, Store} from "../redux";

import ConfigurationActions from "../redux/actions/Configuration";


export interface ConfigurationLocalProps extends DefaultProps {
    isLoading: boolean,
    config: any,
    error: string
    handleReadConfig: () => Promise<any>;
    handleSaveConfig: (data: any) => void;
    writeError: string;
    saveResponse: string;
}

interface State {
    host: string,
    port: string,
    gas: string,
    gasprice: string,
    from: string,
    keystore: string
}

class Configuration extends React.Component<ConfigurationLocalProps, State> {
    public state = {
        host: '',
        port: '',
        gas: '',
        gasprice: '',
        from: '',
        keystore: ''
    };

    public componentWillMount = () => {
        this.props.handleReadConfig()
            .then(() => this.setState({
                host: this.props.config.defaults.host,
                port: this.props.config.defaults.port,
                gas: this.props.config.defaults.gas,
                gasprice: this.props.config.defaults.gasprice,
                from: this.props.config.defaults.from,
                keystore: this.props.config.defaults.keystore
            }));
    };

    public handleConfigSave = () => {
        this.props.handleSaveConfig(this.state);
    };

    public render() {
        const {config, isLoading, saveResponse} = this.props;
        return (
            <React.Fragment>
                <Header as={"h2"}>
                    Configuration

                    <Header.Subheader>
                        Note: To save you must press the save button!
                        <Label>
                            Location
                            <Label.Detail>/Users/danu/.evmlc/config.toml</Label.Detail>
                        </Label>
                    </Header.Subheader>
                </Header>
                <Divider hidden={true}/>
                {config &&
                (<div className={'page'}>
                    <Header as={"h3"}>
                        Connection
                    </Header>
                    <Divider/>
                    <Form>
                        <Form.Field>
                            <label>Host</label>
                            <input defaultValue={config.defaults.host}
                                   onChange={(e) => this.setState({host: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Port</label>
                            <input defaultValue={config.defaults.port}
                                   onChange={(e) => this.setState({port: e.target.value})}/>
                        </Form.Field>
                    </Form>
                    <Header as={"h3"}>
                        Defaults
                    </Header>
                    <Divider/>
                    <Form>
                        <Form.Field>
                            <label>From</label>
                            <input defaultValue={config.defaults.from}
                                   onChange={(e) => this.setState({from: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Gas</label>
                            <input defaultValue={config.defaults.gas}
                                   onChange={(e) => this.setState({gas: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Gas Price</label>
                            <input defaultValue={config.defaults.gasprice}
                                   onChange={(e) => this.setState({gasprice: e.target.value})}/>
                        </Form.Field>
                    </Form>
                    <Header as={"h3"}>
                        Directory
                    </Header>
                    <Divider/>
                    <Form>
                        <Form.Field>
                            <label>Keystore</label>
                            <input defaultValue={config.defaults.keystore}
                                   onChange={(e) => this.setState({keystore: e.target.value})}/>
                        </Form.Field>
                    </Form>
                    <Divider hidden={true}/>
                    <Form>
                        <Form.Field>
                            {isLoading &&
                            (
                                <span className={"m-2"}>
                                        <Icon color={"green"} name={"circle notch"} loading={true}/> Saving...
                                    <br /><br />
                                    </span>
                            )
                            }
                            {!isLoading && saveResponse &&
                            (
                                <span className={"m-2"}>
                                        <Icon color={"green"} name={"thumbs up"} loading={false}/>
                                    {saveResponse}
                                    <br /><br />
                                    </span>
                            )
                            }
                            <Button onClick={this.handleConfigSave} color={'green'}>Save</Button>
                        </Form.Field>
                    </Form>
                </div>)}
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    isLoading: store.config.isLoading,
    config: store.config.readConfigResponse,
    readError: store.config.readConfigError,
    writeError: store.config.saveConfigError,
    saveResponse: store.config.saveConfigResponse
});

const mapDispatchToProps = (dispatch: any) => ({
    handleReadConfig: () => dispatch(ConfigurationActions.handleReadConfig()),
    handleSaveConfig: (data: any) => dispatch(ConfigurationActions.handleSaveConfig(data))
});

export default connect(mapStoreToProps, mapDispatchToProps)(Configuration);