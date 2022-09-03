import React from 'react';
import { connect } from 'react-redux';
import { getGameState } from '../store/gameState';
import { getClientState } from '../store/clientState';
import socket from '../client.js';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: {
        game: {
          clients: [],
          settings: {
            gameId: '',
          },
        },
      },
      username: '',
    };

    this.socket = socket;
  }

  componentDidMount() {
    this.socket.on('newLobby', (lobbyState) => {
      console.log("lobbyState", lobbyState)
      socket.emit('initLobby', lobbyState.gameId, {
        username: 'Lobby Leader',
        clientId: this.socket.id,
        readyCheck: false,
        guessed: false,
        previewPic: {},
        bestGuess: '',
        confidence: [],
        score: 0,
      }, lobbyState.gameState);
      this.props.updateGameState(lobbyState);
      this.setState(this.props);
    });
    this.socket.on('joinedLobby', (newState) => {
      this.props.updateGameState(newState);
      this.setState({ gameState: this.props.gameState });
    });
    // this.socket.on("gameStart", (bool) => {
    //   if (bool) {
    //     setTimeout(() => {
    //       alert("Game start!");
    //     }, 3000);
    //   } else {
    //     return;
    //   }
    // });
    this.socket.on('lobbyUpdate', (newState) => {
      this.props.updateGameState(newState);
      this.setState({ gameState: this.props.gameState });
      console.log('props after joined', this.props);
      console.log('this.state after joined', this.state);
    });
  }

  penClick() {
    let audio = new Audio('/pen_click.mp3');
    audio.play();
  }

  bubbleClick() {
    let audio = new Audio('/bubble.mp3');
    audio.play();
  }

  render() {
    console.log('rendered');
    let players = this.state.gameState.game.clients || [];
    let joinCode = this.state.gameState.game.gameId || '';
    // let players = [];
    return (
      <div className='lobby-container'>
        <table>
          <tbody>
            {players.map((player, index) => {
              return (
                <tr key={index}>
                  <td>{player.username}</td>
                  <td>{player.clientId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ul className='lobby-buttons-wrapper'>
          <li className='boxa'>RULES:</li>
          <button
            className='boxb'
            onClick={() => {
              this.bubbleClick();
              this.socket.emit('toggleReady', joinCode);
              this.socket.emit('readyCheck', joinCode);
              //change style of ready up button
            }}
          >
            Ready Up
          </button>
          <button className='boxc'>{joinCode}</button>
        </ul>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    gameState: state.gameState,
    clientState: state.clientState,
  };
};

const mapDispatch = (dispatch) => {
  return {
    // explicitly forwarding arguments
    updateGameState: (lobbyState) => dispatch(getGameState(lobbyState)),
    updateClientState: (clientState) => dispatch(getClientState(clientState)),
  };
};

export default connect(mapState, mapDispatch)(Lobby);
