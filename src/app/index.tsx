import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Provider as AlertProvider } from 'react-alert';
import { PersistGate } from 'redux-persist/integration/react';

import redux from '../redux.config';

import AlertTemplate from 'react-alert-template-basic';
import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';

const options = {
	timeout: 5000,
	offset: '20px',
	zIndex: 3000000
};

ReactDOM.render(
	<Provider store={redux.stores.store}>
		<AlertProvider
			template={AlertTemplate}
			position={'bottom right'}
			{...options}
			transition={'scale'}
		>
			<PersistGate loading={null} persistor={redux.stores.persistor}>
				<App />
			</PersistGate>
		</AlertProvider>
	</Provider>,
	document.getElementById('root') as HTMLElement
);
