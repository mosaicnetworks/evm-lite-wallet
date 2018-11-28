import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from "react-redux";

import store from "../redux";

import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';

import registerServiceWorker from './server';


ReactDOM.render(
    <Provider store={store}><App/></Provider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
