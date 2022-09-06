import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getGameState } from "../store/gameState";
import { getClientState } from "../store/clientState";
import socket from "../client.js";

class LobbyBrowser extends React.Component {
  constructor() {
    super();
    this.state = {
      lobbies: [],
      input: "",
      username: "",
    };
    this.socket = socket;
    this.handleChange = this.handleChange.bind(this);
  }

  penClick() {
    let audio = new Audio("/pen_click.mp3");
    audio.play();
  }

  pencilClick() {
    let audio = new Audio("/pencil.mp3");
    audio.play();
  }

  componentDidMount() {
    console.log("LobbyBrowser.js mounted");
    socket.on("lobbies", (lobbyArr) => {
      this.setState({ lobbies: lobbyArr });
      this.forceUpdate();
      console.log("total state from server", this.state);
    });
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleInputChange(event) {
    event.target.value = event.target.value.toUpperCase();
    this.setState({ input: event.target.value });
  }

  render() {
    let lobbies = this.state.lobbies || [];
    console.log("Looooooooooobies", lobbies);
    return (
      <div className="lobby-browser-container">
        <input
          className="smallMargin homeButtons"
          type="text"
          placeholder="Name Here!"
          value={this.state.username}
          onChange={(event) => this.handleChange(event)}
        ></input>
        <table>
          <thead>
            <tr>
              <th>Lobby Name</th>
              <th>Host Name</th>
              <th>Locked ?</th>
              <th>Players</th>
            </tr>
          </thead>
          <tbody>
            {lobbies.map((lobby, index) => (
              <tr
                key={index}
                onClick={() => {
                  this.state.input = lobby.gameId;
                  this.pencilClick();
                  console.log("this.state.input clicked", this.state.input);
                  this.forceUpdate();
                }}
              >
                <td>{lobby.lobbyName ? lobby.lobbyName : lobby.gameId}</td>
                <td>
                  {lobby.clients[0] ? lobby.clients[0].username : "No Host"}
                </td>
                <td>{lobby.locked ? "private" : "public"}</td>
                <td>{`${lobby.clients.length} / ${lobby.gameState.maxPlayers}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lobby-browser-footer">
          <div>
            <input
              className="homeButtons input40"
              type="text"
              placeholder="Code"
              maxLength="5"
              value={this.state.input}
              onChange={(event) => this.handleInputChange(event)}
            ></input>
            <Link to="/lobby">
              <button
                className="homeButtons hov"
                onClick={() => {
                  this.penClick();
                  console.log("join room");
                  console.log("homeLobby state", this.state);
                  socket.emit("joinLobby", this.state.input, {
                    username: this.state.username,
                    clientId: this.socket.id,
                    readyCheck: false,
                    guessed: false,
                    previewPic: {},
                    bestGuess: "",
                    confidence: [],
                    score: 0,
                  });
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

export default connect(mapState, mapDispatch)(LobbyBrowser);
