import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Feed from './Feed';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';

export default () => 
    <Switch>
        <Route path="/" exact component = {Feed}/>
        <Route path='/login' exact component = {Login}/>
        <Route path='/signup' exact component = {Signup}/>
        <Route component = {NotFound}/>
    </Switch>;