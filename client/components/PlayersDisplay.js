import React from "react";
import Player from "./Player";

const PlayersView = (props) => {
  const { players, confidence, wordToDraw } = props;
  return (
    <div id="playersDisplay">
      <div>
        {players.map((player) => {
          return (
            <div
              className={
                player.correctStatus
                  ? "playerInfoBoxCorrect"
                  : "playerInfoBoxGuessing"
              }
              key={player.name}
            >
              <div className="column">
                <h4 className="playerNameText">{player.name}</h4>
                <h4 className="playerInfoText">
                  Drawing: {player.correctStatus ? `${wordToDraw}!` : <></>}
                  {confidence[0] && player.correctStatus === false
                    ? `${confidence[0].label}?`
                    : ""}
                </h4>
                <h4 className="playerInfoText">Score: {player.points}</h4>
              </div>
              <img
                className="miniDrawing"
                src="https://i.imgur.com/LkWiJ0P.png"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersView;