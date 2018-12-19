import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from "react-redux";
import {Provider as AlertProvider} from 'react-alert'
// @ts-ignore
import AlertTemplate from 'react-alert-template-basic'
import getStores from "../redux";

import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';
import {PersistGate} from "redux-persist/integration/react";

const options = {
    timeout: 5000,
    offset: '30px',
    zIndex: 3000000,
};

const stores = getStores();
ReactDOM.render(
    (
        <Provider store={stores.store}>
            <AlertProvider template={AlertTemplate} position={'bottom right'} {...options} transition={'scale'}>
                <PersistGate loading={null} persistor={stores.persistor}>
                    <App/>
                </PersistGate>
            </AlertProvider>
        </Provider>
    ),
    document.getElementById('root') as HTMLElement);
