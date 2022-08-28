import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './App'
import io from 'socket.io-client'

// const clientSocket = io('http://localhost:8081');
const clientSocket = io(window.location.origin);

clientSocket.on('connect', () => {
  console.log('Client connected: client', clientSocket);
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
