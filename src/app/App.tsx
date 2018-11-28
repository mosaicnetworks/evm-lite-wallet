import * as React from 'react';

import {connect} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";

import Accounts from "../pages/Accounts";
import Index from "../pages/Index";
import Configuration from "../pages/Configuration";
import Wrapper from "../components/Wrapper";

import {AccountsActions, ConfigActions, DefaultProps, Store} from "../redux";

import './styles/App.css';

export interface AppLocalProps extends DefaultProps {
    handleFetchLocalAccounts: () => void;
    handleReadConfig: () => Promise<any>;
}

class App extends React.Component<AppLocalProps, any> {
    public componentDidMount = () => {
        this.props.handleReadConfig()
            .then(() => this.props.handleFetchLocalAccounts())
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

const mapStoreToProps = (store: Store) => ({});

const mapsDispatchToProps = (dispatch: any) => ({
    handleFetchLocalAccounts: () => dispatch(AccountsActions.handleFetchLocalAccounts()),
    handleReadConfig: () => dispatch(ConfigActions.handleReadConfig()),
});

export default connect(mapStoreToProps, mapsDispatchToProps)(App);