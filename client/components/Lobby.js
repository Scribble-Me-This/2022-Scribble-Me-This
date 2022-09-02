import React from "react";
import { connect } from "react-redux";
import { getGameState } from "../store/gameState";
import { getClientState } from "../store/clientState";
import socket from "../client.js";

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: {
        game: {
          clients: [],
        },
      },
      username: "",
    };

    this.socket = socket;
  }

  componentDidMount() {
    this.socket.on("newLobby", (lobbyState) => {
      socket.emit(
        "joinLobby",
        lobbyState.settings.gameId,
        {
          username: "",
          clientId: this.socket.id,
          readyCheck: false,
          guessed: false,
          previewPic: {},
          bestGuess: "",
          confidence: [],
          score: 0,
        }
      );
      this.props.lobbyInstanceUpdater(lobbyState);
      this.props.updateGameState(lobbyState);
      this.setState(this.props);
    });
    this.socket.on("joinedLobby", (newState) => {
      console.log("joinedLobby GOT", newState);
      this.props.lobbyInstanceUpdater(newState);
      this.props.updateGameState(newState);
      console.log("props after joined", this.props);
      console.log("this.state after joined", this.state);
    });
  }

  render() {
    console.log("rendered");
    let players = this.state.gameState.game.clients || [];
    return (
      <div className="lobby-container">
        <table>
          <tbody>
            {players.map((player, index) => {
              return (
                <tr key={index}>
                  <td>{player}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ul className="lobby-buttons-wrapper">
          <li className="boxa">RULES:</li>
          <button className="boxb">Ready Up</button>
          <button className="boxc">Join Code</button>
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
