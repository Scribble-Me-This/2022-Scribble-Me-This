import { render } from "enzyme";
import React from "react";
import MiniCanvas from "./MiniCanvas";
import Player from "./Player";

class PlayersView extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { players, confidence, wordToDraw, drawingData } = this.props;
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
                key={player.playerId}
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
                <MiniCanvas drawingData={drawingData} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function drawPixel(color, context, x, y, size) {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
}

export default PlayersView;
