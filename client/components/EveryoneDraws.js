import React from "react";

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

class EveryoneDraws extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 30,
      wordToDraw: "",
      players: [],
      activeRound: false,
    };
  }

  render() {
    const { activeRound } = this.state;
    return (
      <div>
        {activeRound ? (
          <button
            onClick={() => {
              this.setState({
                activeRound: false,
              });
            }}
          >
            End
          </button>
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
        timer: 30,
        wordToDraw: possibilities[rand],
        activeRound: true
     });
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
