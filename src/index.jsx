import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/';
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/fonts.css';
import './assets/css/main.css';
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'popper.js/';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AppContextProvider} from './context/AppContext';
import {SnackbarProvider} from 'notistack';

ReactDOM.render(
    <AppContextProvider>
        <SnackbarProvider maxSnack={20}>
            <App/>
        </SnackbarProvider>
    </AppContextProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
