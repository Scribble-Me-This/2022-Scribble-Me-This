import React from "react";
import socket from "../client";

class GameResults extends React.Component {
  render() {
    console.log("game results page");
    const { players } = this.props;
    const { socket } = this.props;
    console.log("players", players);
    players.sort((a, b) => b.points - a.points);
    return (
      <div>
        <div className="row">
          <div className="boxa">
            <h1>End of Round</h1>
            {players.map((player, index) => (
              <h2>
                {" "}
                #{index + 1}: {player.name} - {player.points} points{" "}
              </h2>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            socket.emit("leaveLobby");
          }}
        >
          Leave Game
        </button>
      </div>
    );
  }
}

export default GameResults;
