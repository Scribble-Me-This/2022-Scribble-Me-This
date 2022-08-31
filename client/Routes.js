import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Lobby from './components/Lobby/Lobby';
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
            <Route path='/instance' component={Instance} />
            <Route path='/home' component={Home} />
            <Route path='/lobby' component={Lobby} />
            <Redirect to='/home' />
          </Switch>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
  };
};

const mapDispatch = (dispatch) => {
  return {
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
