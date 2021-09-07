import React from 'react';
import {Redirect, Route} from 'react-router-dom';

const PrivateRoute = props => {

    const token = localStorage.getItem('token');
    const {Component, path, ...rest} = props;

    return (
        <Route
            {...rest}
            render={props =>
                token !== null ? <Component {...props} /> : <Redirect to="/login"/>
            }
        />
    );
};

export default PrivateRoute;
