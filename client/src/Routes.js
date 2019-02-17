import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Feed from './Feed';
import NotFound from './containers/NotFound';
import Login from './containers/Login';

export default () => 
    <Switch>
        <Route path="/" exact component = {Feed}/>
        <Route path='/login' exact component = {Login}/>
        <Route component = {NotFound}/>
    </Switch>;