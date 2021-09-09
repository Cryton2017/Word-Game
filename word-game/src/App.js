import React, { Component } from 'react';
import { Route, Redirect, Router } from 'react-router-dom';
import { Auth } from '../src/auth';

import Home from './Home/Home';
import playerLogin from './playerLogin/playerLogin';
import playerDashboard from './playerDashboard/playerDashboard';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
  Auth.isAuthenticated === true
    ? <Component {...props} />
    : <Redirect to={{
        pathname: '/'
      }} />
  )} />
  
)

function App() {
  return (
    <div>
        <Route exact path="/" component={Home} />
        {/* <Route exact path="/adminLogin" component={adminLogin} /> */}
        {/* <PrivateRoute exact path='/admin/Dashboard' component={facilitatorDashboard} /> */}
        <Route exact path="/playerLogin" component={playerLogin} />
        <PrivateRoute exact path='/player/Dashboard' component={playerDashboard} />
      </div>
  );
}

export default App;
