import * as React from 'react';

import {connect} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";
import {withAlert} from 'react-alert';

import Accounts from "../pages/Accounts";
import Index from "../pages/Index";
import Configuration from "../pages/Configuration";
import Wrapper from "../components/Wrapper";

import {app, configuration, DataDirectoryParams, DefaultProps, keystore, Store} from "../redux";

import Defaults from "../classes/Defaults";

import './styles/App.css';


export interface ApplicationLocalProps extends DefaultProps {
    // thunk action handlers
    handleFetchLocalAccounts: () => void;
    handleReadConfig: () => Promise<any>;
    handleDataDirectoryInit: (data: DataDirectoryParams) => void;

    dataDirectory: string;
}

class App extends React.Component<ApplicationLocalProps, any> {
    public componentDidMount = () => {
        this.props.handleDataDirectoryInit({path: this.props.dataDirectory || Defaults.dataDirectory});
    };

    public render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <Wrapper>
                        <Route exact={true} path="/" component={Index}/>
                        <Route path="/accounts" component={Accounts}/>
                        <Route path="/configuration" component={Configuration}/>
                    </Wrapper>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    dataDirectory: store.app.dataDirectory.response
});

const mapsDispatchToProps = (dispatch: any) => ({
    handleFetchLocalAccounts: () => dispatch(keystore.handleFetch()),
    handleReadConfig: () => dispatch(configuration.handleRead()),
    handleDataDirectoryInit: (data: DataDirectoryParams) => dispatch(app.handleDataDirInitThenPopulateApp(data)),
});

export default connect(mapStoreToProps, mapsDispatchToProps)(withAlert(App));