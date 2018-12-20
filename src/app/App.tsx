import * as React from 'react';

import {connect} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";
import {InjectedAlertProp, withAlert} from 'react-alert';

import Accounts from "../pages/Accounts";
import Index from "../pages/Index";
import Configuration from "../pages/Configuration";
import Wrapper from "../components/Wrapper";

import {app, configuration, DataDirectoryParams, keystore, Store} from "../redux";

import Defaults from "../classes/Defaults";

import './styles/App.css';


interface AlertProps {
    alert: InjectedAlertProp;
}

interface StoreProps {
    dataDirectory: string | null;
}

interface DispatchProps {
    handleFetchLocalAccounts: () => void;
    handleReadConfig: () => Promise<any>;
    handleDataDirectoryInit: (data: DataDirectoryParams) => void;
}

interface OwnProps {
    empty?: null;
}

type LocalProps = OwnProps & DispatchProps & StoreProps & AlertProps;

class App extends React.Component<LocalProps, any> {
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

const mapStoreToProps = (store: Store): StoreProps => ({
    dataDirectory: store.app.dataDirectory.response
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
    handleFetchLocalAccounts: () => dispatch(keystore.handleFetch()),
    handleReadConfig: () => dispatch(configuration.handleRead()),
    handleDataDirectoryInit: (data: DataDirectoryParams) => dispatch(app.handleDataDirInitThenPopulateApp(data)),
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
    mapStoreToProps,
    mapsDispatchToProps
)(withAlert<AlertProps>(App))
