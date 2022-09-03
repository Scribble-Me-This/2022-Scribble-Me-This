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
    };
    this.socket = socket;
  }

  componentDidMount() {
    this.socket.on("lobbies", (lobbyList) => {
      console.log("lobbies", lobbyList);
      this.setState({ lobbies: lobbyList });
      console.log("state", this.state);
    });
    this.socket.emit("viewLobbies");
  }

  render() {
    let lobbies = this.state.lobbies || [];
    return (
      <div className="lobby-browser-container">
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
              <tr key={index}>
                <td>{lobby.lobbyName}</td>
                <td>{lobby.hostName}</td>
                <td>{lobby.locked ? "private" : "public"}</td>
                <td>{lobby.numberOfPlayers}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lobby-browser-footer">
          <button className="lobby-id-input-btn">Lobby ID Input Here</button>
          <Link to="/lobby">
            <button className="lobby-join-game-btn">Join Game</button>
          </Link>
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
