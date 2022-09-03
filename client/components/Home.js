import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import socket from '../client.js';
import { getGameState } from '../store/gameState';

/**
 * COMPONENT
 */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      input: '',
    };
    this.socket = socket;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleInputChange(event) {
    this.setState({ input: event.target.value });
  }

  componentDidMount() {}

  penClick() {
    let audio = new Audio('/pen_click.mp3');
    audio.play();
  }

  render() {
    return (
      <div>
        <div className='centerWrapper'>
          <input
            className='smallMargin homeButtons'
            type='text'
            placeholder='Name Here!'
            value={this.state.username}
            onChange={(event) => this.handleChange(event)}
          ></input>
          <Link to='/lobbybrowser'>
            <button
              className='join homeButtons hov'
              onClick={() => {
                this.penClick();
              }}
            >
              View Lobbies
            </button>
          </Link>
          <div className='flex'>
            <Link to='/lobby'>
              <button
                className='homeButtons hov'
                onClick={() => {
                  this.penClick();
                  socket.emit('newLobby');
                }}
              >
                Create Room
              </button>
            </Link>
            <div className='smallWrapper'>
              <img
                className='flex'
                src='/assets/leftArrow.svg'
                height='50px'
                width='100px'
              />
              <img
                className='flex'
                src='/assets/rightArrow.svg'
                height='50px'
                width='100px'
              />
            </div>
            <input
              className='homeButtons input40'
              type='text'
              placeholder='Code'
              maxLength='5'
              value={this.state.input}
              onChange={(event) => this.handleInputChange(event)}
            ></input>
            <Link to='/lobby'>
              <button
                className='homeButtons hov'
                onClick={() => {
                  this.penClick();
                  console.log('join room');
                  console.log( "homeLobby state", this.state)
                  socket.emit('joinLobby', this.state.input, {
                    username: this.state.username,
                    clientId: this.socket.id,
                    readyCheck: false,
                    guessed: false,
                    previewPic: {},
                    bestGuess: '',
                    confidence: [],
                    score: 0,
                  }, this.state.gameState);
                }}
              >
                Submit
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    gameState: state.gameState,
  };
};

const mapDispatch = (dispatch) => {
  return {
    // explicitly forwarding arguments
    updateGameState: (lobbyState) => dispatch(getGameState(lobbyState)),
    updateClientState: (clientState) => dispatch(getClientState(clientState)),
  };
};

export default connect(mapState, mapDispatch)(Home);
