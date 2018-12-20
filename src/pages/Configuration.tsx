import * as React from 'react';

import {InjectedAlertProp, withAlert} from "react-alert";
import {connect} from "react-redux";

import {Button, Divider, Form, Header, Icon} from "semantic-ui-react";

import {app, ConfigSchema, configuration, DataDirectoryParams, Store} from "../redux";
import {SaveConfigParams} from "../redux/actions/Configuration";
import Defaults from "../classes/Defaults";
import {ConfigReducer} from "../redux/reducers/Configuration";


interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    dataDirectory: string | null;
    config: ConfigReducer;
}

interface DispatchProps {
    handleSaveConfig: (data: SaveConfigParams) => Promise<ConfigSchema>;
    handleReadConfig: () => Promise<ConfigSchema>;
    handleDataDirectoryInit: (data: DataDirectoryParams) => void;

}

interface OwnProps {
    empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

interface State {
    host: string,
    port: string,
    gas: string,
    gasprice: string,
    from: string,
    keystore: string
}

class Configuration extends React.Component<LocalProps, State> {
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
            this.handleReadConfig().then();
        }
    };

    public setVars(response: any) {
        this.setState({
            host: response.connection.host,
            port: response.connection.port,
            from: response.defaults.from,
            gas: response.defaults.gas,
            gasprice: response.defaults.gasPrice,
            keystore: response.storage.keystore
        });
    }

    public handleConfigSave = () => {
        const config: ConfigSchema = {
            connection: {
                host: this.state.host,
                port: parseInt(this.state.port, 10),
            },
            storage: {
                keystore: this.state.keystore,

            },
            defaults: {
                gas: parseInt(this.state.gas, 10),
                from: this.state.from,
                gasPrice: parseInt(this.state.gasprice, 10),
            }
        };
        this.props.handleSaveConfig({config})
            .then(() => this.props.alert.success('Configuration successfully saved.'))
            .then(() => this.props.handleDataDirectoryInit({path: this.props.dataDirectory || Defaults.dataDirectory}));
    };

    public handleReadConfig = async () => {
        const config = await this.props.handleReadConfig();
        this.setVars(config);
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
                                <input defaultValue={config.read.response.connection.host}
                                       onChange={(e) => this.setState({host: e.target.value})}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Port</label>
                                <input defaultValue={config.read.response.connection.port.toString()}
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
                                <input defaultValue={config.read.response.defaults.gas.toString()}
                                       onChange={(e) => this.setState({gas: e.target.value})}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Gas Price</label>
                                <input defaultValue={config.read.response.defaults.gasPrice.toString()}
                                       onChange={(e) => this.setState({gasprice: e.target.value})}/>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form.Field>
                            <label>Keystore</label>
                            <input defaultValue={config.read.response.storage.keystore}
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

const mapStoreToProps = (store: Store): StoreProps => ({
    config: store.config,
    dataDirectory: store.app.dataDirectory.response,
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    handleSaveConfig: (data: SaveConfigParams) => dispatch(configuration.handleSaveThenRefreshApp(data)),
    handleReadConfig: () => dispatch(configuration.handleRead()),
    handleDataDirectoryInit: (data: DataDirectoryParams) => dispatch(app.handleDataDirInitThenPopulateApp(data)),
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapDispatchToProps
)(withAlert<AlertProps>(Configuration));