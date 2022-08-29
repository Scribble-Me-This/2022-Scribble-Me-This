import React from "react";
import Instance from "./Instance";
import Canvas from "./Canvas";


let possibilities = [
  "airplane",
  "banana",
  "candle",
  "cat",
  "dog",
  "fish",
  "flower",
  "guitar",
  "house",
  "penguin",
];
let clock;

class EveryoneDraws extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 60,
      wordToDraw: "",
      players: [],
      activeRound: false,
    };
  }

  render() {
    const { activeRound, wordToDraw, timer } = this.state;
    return (
      <div>
        {activeRound ? (
          <div>
            <button
              onClick={() => {
                this.endRound();
              }}
            >
              End
            </button>
            <Instance wordToDraw={wordToDraw} timer={timer} />
          </div>
        ) : (
          <button
            onClick={() => {
              this.beginRound();
            }}
          >
            Start
          </button>
        )}
      </div>
    );
  }

  beginRound = () => {
    let rand = Math.floor(Math.random() * possibilities.length);
    this.setState({
      timer: 60,
      wordToDraw: possibilities[rand],
      activeRound: true,
    });
    console.log("start round:", this.state);
    this.startClock();
  };

  endRound = () => {
    this.setState({
      activeRound: false,
    });
    console.log("end round:", this.state);
    this.stopClock();
  };

  gameTick = () => {
    this.setState({
      timer: (this.state.timer -= 0.05).toFixed(2),
    });
  };

  startClock = () => {
    clock = setInterval(() => this.gameTick(), 50);
  };

  stopClock = () => {
    clearInterval(clock);
  };
}

class Player {
  constructor(name, points, drawingData, topGuess, correctStatus) {
    this.name = name;
    this.points = points;
    this.drawingData = drawingData;
    this.topGuess = topGuess;
    this.correctStatus = correctStatus;
  }
}

export default EveryoneDraws;
