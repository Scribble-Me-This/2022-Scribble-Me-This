import React from "react";
import { connect } from "react-redux";
import { getGameState } from "../store/gameState";
import socket from "../client.js";

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.socket = socket;
  }

  componentDidMount() {
    this.socket.on("newLobby", (lobbyState) => {
      console.log("newLobby GOT", lobbyState);
      this.props.lobbyInstanceUpdater(lobbyState);
      this.props.updateState(lobbyState);
    });
  }

  render() {
    console.log("state in lobby", this.state);
    let players = ["playa 1", "playa 2", "playa 3", "playa 4"];
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
  };
};

const mapDispatch = (dispatch) => {
  return {
    // explicitly forwarding arguments
    updateState: (lobbyState) => dispatch(getGameState(lobbyState)),
  };
};

export default connect(mapState, mapDispatch)(Lobby);
