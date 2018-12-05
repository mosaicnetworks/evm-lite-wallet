import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from "react-redux";
import {Provider as AlertProvider} from 'react-alert'

// @ts-ignore
import AlertTemplate from 'react-alert-template-basic'
import store from "../redux";

import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';

const options = {
    timeout: 5000,
    offset: '30px',
    zIndex: 3000000,
};

ReactDOM.render(
    (
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} position={'bottom right'} {...options} transition={'scale'}>
                <App/>
            </AlertProvider>
        </Provider>
    ),
    document.getElementById('root') as HTMLElement);
