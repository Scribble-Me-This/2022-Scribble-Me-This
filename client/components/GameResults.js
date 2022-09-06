import React from "react";

class GameResults extends React.Component {
  render() {
    console.log("game results page");
    const { players } = this.props;
    console.log("players", players);
    players.sort((a, b) => b.points - a.points);
    return (
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
    );
  }
}

export default GameResults;
