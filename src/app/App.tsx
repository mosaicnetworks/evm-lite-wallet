import * as React from 'react';

import {BrowserRouter, Route} from "react-router-dom";

import Accounts from "../pages/Accounts";
import Index from "../pages/Index";
import Configuration from "../pages/Configuration";
import Wrapper from "../components/Wrapper";

import './styles/App.css';


class App extends React.Component<any, any> {
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

export default App;
