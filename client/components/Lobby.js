import React from "react";
import { connect } from "react-redux";
import { getGameState } from "../store/gameState";
import { getClientState } from "../store/clientState";
import Rules from "./Rules";
import LockedRules from "./LockedRules";
import socket from "../client.js";

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: {
        game: {
          clients: [],
          settings: {
            gameId: "",
          },
        },
      },
      username: "",
    };

    this.socket = socket;
  }

  componentDidMount() {
    console.log("Lobby.js mounted");
    this.socket.on("newLobby", (lobbyState) => {
      socket.emit(
        "initLobby",
        lobbyState.gameId,
        {
          username: "Lobby Leader",
          clientId: this.socket.id,
          readyCheck: false,
          guessed: false,
          previewPic: {},
          bestGuess: "",
          confidence: [],
          score: 0,
        },
        lobbyState.gameState
      );
      this.props.updateGameState(lobbyState);
      this.setState(this.props);
    });
    this.socket.on("joinedLobby", (newState) => {
      this.props.updateGameState(newState);
      this.setState({ gameState: this.props.gameState });
    });
    this.socket.on("lobbyUpdate", (newState) => {
      this.props.updateGameState(newState);
      this.setState({ gameState: this.props.gameState });
      console.log("this.state after joined", this.state);
    });
    socket.on("beginRound", (gameState) => {
      console.log("beginRound");
      this.setState(gameState);
      this.forceUpdate();
    });
    socket.on("reloadPage", () => {
      this.forceUpdate();
    });
  }

  penClick() {
    let audio = new Audio("/pen_click.mp3");
    audio.play();
  }

  pencilClick() {
    let audio = new Audio("/pencil.mp3");
    audio.play();
  }

  bubbleClick() {
    let audio = new Audio("/bubble.mp3");
    audio.play();
  }

  render() {
    console.log("rendered");
    let currentGame = this.state || {};
    let leader = currentGame.gameState.game.leader || "";
    let players = currentGame.gameState.game.clients || [];
    let joinCode = currentGame.gameState.game.gameId || "";
    console.log("currentGame", currentGame);
    // let players = [];
    return (
      <div className="lobby-container">
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
        <ul className="lobby-buttons-wrapper">
          <li className="boxa">
            RULES:
            <div>{this.socket.id === leader ? (
            <div>
              <Rules props={currentGame} />
            </div>
            ) : (
            <div>
              <LockedRules props={currentGame}/>
            </div>)
            }</div>
          </li>
          <button
            className="boxb"
            onClick={() => {
              this.bubbleClick();
              this.socket.emit("toggleReady", joinCode);
              this.socket.emit("readyCheck", joinCode);
              //change style of ready up button
            }}
          >
            Ready Up
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(joinCode);
            }}
            className="boxc"
          >
            {joinCode}
          </button>
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
