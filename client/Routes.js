import React, { Component, Fragment } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Lobby from './components/Lobby';
import LobbyBrowser from './components/LobbyBrowser';
import Instance from './components/Instance';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
          <Switch>
            <Route exact path='/home' component={Home} />
            <Route exact path='/lobby' component={Lobby} />
            <Route path='/lobbybrowser' component={LobbyBrowser} />
            <Route path='/instance' component={Instance} />
            <Redirect to='/home' />
          </Switch>
      </div>
    );
  }
}


export default Routes;
