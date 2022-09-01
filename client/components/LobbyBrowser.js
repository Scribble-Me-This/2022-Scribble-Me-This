import React from "react";
import { Link } from "react-router-dom";
import data from "./mock-lobby-data.json";

class LobbyBrowser extends React.Component() {
  constructor() {
    super();
    this.state = {
      lobbies: data,
    };
  }

  render() {
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

export default LobbyBrowser;
