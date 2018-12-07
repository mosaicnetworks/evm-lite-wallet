import * as React from 'react';

import {withAlert} from "react-alert";
import {connect} from "react-redux";

import {Button, Divider, Form, Header, Icon} from "semantic-ui-react";

import {ConfigSchema, configuration, DefaultProps, Store} from "../redux";
import {SaveConfigParams} from "../redux/actions/Configuration";

export interface ConfigurationLocalProps extends DefaultProps {
    config: {
        read: {
            isLoading: boolean,
            response: any,
            error: string
        },
        save: {
            isLoading: boolean,
            response: string,
            error: string
        }
    },
    handleSaveConfig: (data: SaveConfigParams) => Promise<ConfigSchema>;
    handleReadConfig: () => Promise<ConfigSchema>;
    dataDirectory: string;
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

    public componentDidMount = () => {
        const {response} = this.props.config.read;
        if (response) {
            this.setVars(response)
        } else {
            this.handleReadConfig();
        }
    };

    public setVars(response: any) {
        this.setState({
            host: response.defaults.host,
            port: response.defaults.port,
            from: response.defaults.from,
            gas: response.defaults.gas,
            gasprice: response.defaults.gasprice,
            keystore: response.defaults.keystore
        });
    }

    public handleConfigSave = () => {
        const config: ConfigSchema = {
            defaults: {
                host: this.state.host,
                port: this.state.port,
                keystore: this.state.keystore,
                gas: this.state.gas,
                from: this.state.from,
                gasprice: this.state.gasprice,
            }
        };
        this.props.handleSaveConfig({config})
            .then(() => this.props.alert.success('Configuration successfully saved.'))
    };

    public handleReadConfig = () => {
        this.props.handleReadConfig()
            .then((config) => this.setVars(config));
    };

    public render() {
        const {config, dataDirectory} = this.props;
        return (
            <React.Fragment>
                <Header as='h2'>
                    <Icon name='cog'/>
                    <Header.Content>
                        Configuration
                        <Header.Subheader>Location: {dataDirectory}/config.toml</Header.Subheader>
                    </Header.Content>
                    <Divider/>
                </Header>
                <Divider hidden={true}/>
                {config.read.response &&
                (<div className={'page'}>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>Host</label>
                                <input defaultValue={config.read.response.defaults.host}
                                       onChange={(e) => this.setState({host: e.target.value})}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Port</label>
                                <input defaultValue={config.read.response.defaults.port}
                                       onChange={(e) => this.setState({port: e.target.value})}/>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>From</label>
                                <input defaultValue={config.read.response.defaults.from}
                                       onChange={(e) => this.setState({from: e.target.value})}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Gas</label>
                                <input defaultValue={config.read.response.defaults.gas}
                                       onChange={(e) => this.setState({gas: e.target.value})}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Gas Price</label>
                                <input defaultValue={config.read.response.defaults.gasprice}
                                       onChange={(e) => this.setState({gasprice: e.target.value})}/>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form.Field>
                            <label>Keystore</label>
                            <input defaultValue={config.read.response.defaults.keystore}
                                   onChange={(e) => this.setState({keystore: e.target.value})}/>
                        </Form.Field>
                    </Form>
                    <Divider hidden={true}/>
                    <Form>
                        <Form.Field>
                            {config.save.isLoading &&
                            (<span className={"m-2"}>
                                <Icon color={"green"} name={"circle notch"}
                                      loading={true}/> Saving...<br/><br/></span>)}
                            <Button icon={true} onClick={this.handleConfigSave} color={'green'}><Icon name='save'/> Save</Button>
                        </Form.Field>
                    </Form>
                </div>)}
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    config: store.config,
    dataDirectory: store.app.dataDirectory.response,
});

const mapDispatchToProps = (dispatch: any) => ({
    handleSaveConfig: (data: SaveConfigParams) => dispatch(configuration.handleSaveThenRefreshApp(data)),
    handleReadConfig: () => dispatch(configuration.handleRead()),
});

export default connect(mapStoreToProps, mapDispatchToProps)(withAlert(Configuration));