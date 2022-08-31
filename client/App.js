import Navbar from "./components/Navbar";
import Routes from "./Routes";
import React from "react";
import ml5 from "ml5";
import { forEach } from "lodash";

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
const options = {
  task: "classification",
  debug: false,
};
const nn = ml5.neuralNetwork(options);
const modelDetails = {
  model: "./model.json",
  metadata: "./model_meta.json",
  weights: "./model.weights.bin",
};
let context;
let stack = [];
let undoing = false;
const height = 280;
const width = 280;

class Player {
  constructor(name, points, drawingData, topGuess, correctStatus) {
    this.name = name;
    this.points = points;
    this.drawingData = drawingData;
    this.topGuess = topGuess;
    this.correctStatus = correctStatus;
  }
}

const Canvas = () => {
  return (
    <div className="column">
      <canvas id="canvas" className="canvas" height="280" width="280" />
      <div className="row">
        <button
          onClick={() => {
            clearCanvas(context);
          }}
        >
          clear
        </button>
        <button
          onClick={() => {
            if (!stack.length) return;
            if (!undoing) {
              undoing = true;
              stack.pop();
            }
            context.putImageData(stack.pop(), 0, 0);
            mapPixels(context);
          }}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

nn.load(modelDetails, finishLoad());

let player1 = new Player("Host", 0, null, null, false);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timeSetting: 15,
      timer: null,
      wordToDraw: "",
      players: [player1],
      activeRound: false,
      confidence: [],
      canvasLoaded: false,
      totalRounds: 5,
      currentRound: 1,
    };
  }

  render() {
    const {
      wordToDraw,
      activeRound,
      timer,
      confidence,
      currentRound,
      totalRounds,
      players,
    } = this.state;
    return (
      <div>
        <Navbar />
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
              <div className="column">
                <div className="instanceStats">
                  <h3> Time: {timer} </h3>
                  <h3>
                    {" "}
                    Round: {currentRound} / {totalRounds}{" "}
                  </h3>
                  <h3> Drawing: {wordToDraw} </h3>
                </div>
                <div className="canvasEtc">
                  {/* CONFIDENCE COLUMN */}

                  <div className="confidence">
                    {confidence[0] ? (
                      <div>
                        <h2 className="oneGuess">
                          1. {confidence[0].label}{" "}
                          {(confidence[0].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          2. {confidence[1].label}{" "}
                          {(confidence[1].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          3. {confidence[2].label}{" "}
                          {(confidence[2].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          4. {confidence[3].label}{" "}
                          {(confidence[3].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          5. {confidence[4].label}{" "}
                          {(confidence[4].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          6. {confidence[5].label}{" "}
                          {(confidence[5].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          7. {confidence[6].label}{" "}
                          {(confidence[6].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          8. {confidence[7].label}{" "}
                          {(confidence[7].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          9. {confidence[8].label}{" "}
                          {(confidence[8].confidence * 100).toFixed(2)}%
                        </h2>
                        <h2 className="oneGuess">
                          10. {confidence[9].label}{" "}
                          {(confidence[9].confidence * 100).toFixed(2)}%
                        </h2>
                      </div>
                    ) : (
                      "Start drawing!"
                    )}
                  </div>

                  {/* CANVAS */}

                  <Canvas id="canvas" />
                  {this.loadCanvasLogic(this.mapPixels)}

                  {/* PLAYERS DISPLAY */}

                  <div id="playersDisplay">
                  <div>
                    {this.state.players.map(player => {
                      return(
                      <div className="playerInfoBox" key={player.name}>
                        <div className="column">
                          <h4 className="playerNameText">{player.name}</h4>
                          <h4 className="playerInfoText">Drawing: {confidence[0]? `${confidence[0].label} ?`: ""}</h4>
                          <h4 className="playerInfoText">Score: {player.points}</h4>
                        </div>
                        <img
                          className="miniDrawing"
                          src="https://i.imgur.com/LkWiJ0P.png"
                        />
                      </div>
                      )
                    
                    })
                    
                    }

                      <div className="playerInfoBox">
                        <div className="column">
                          <h4 className="playerNameText">Warren</h4>
                          <h4 className="playerInfoText">Drawing: Banana?</h4>
                          <h4 className="playerInfoText">Score: 1230</h4>
                        </div>
                        <img
                          className="miniDrawing"
                          src="https://i.imgur.com/LkWiJ0P.png"
                        />
                      </div>
                      {/*}
                      <div className="playerInfoBox">
                        <div className="column">
                          <h4 className="playerNameText">David</h4>
                          <h4 className="playerInfoText">Drawing: Cat?</h4>
                          <h4 className="playerInfoText">Score: 1150</h4>
                        </div>
                        <img
                          className="miniDrawing"
                          src="https://i.imgur.com/36KCLV0.png"
                        />
                      </div>
                      <div className="playerInfoBoxCorrect">
                        <div className="column">
                          <h4 className="playerNameText">Alex</h4>
                          <h4 className="playerInfoText">Drawing: Penguin!</h4>
                          <h4 className="playerInfoText">Score: 1420</h4>
                        </div>
                        <img
                          className="miniDrawing"
                          src="https://i.imgur.com/mjUzLBr.png"
                        />
                      </div>
                      <div className="playerInfoBoxCorrect">
                        <div className="column">
                          <h4 className="playerNameText">Harrison</h4>
                          <h4 className="playerInfoText">Drawing: Penguin!</h4>
                          <h4 className="playerInfoText">Score: 1100</h4>
                        </div>
                        <img
                          className="miniDrawing"
                          src="https://i.imgur.com/mjUzLBr.png"
                        />
                      </div>
                      <div className="playerInfoBox">
                        <div className="column">
                          <h4 className="playerNameText">Jimothy</h4>
                          <h4 className="playerInfoText">Drawing: Banana?</h4>
                          <h4 className="playerInfoText">Score: 50</h4>
                        </div>
                        <img
                          className="miniDrawing"
                          src="https://i.imgur.com/LkWiJ0P.png"
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
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
        <Routes />
      </div>
    );
  }

  beginRound = () => {
    let rand = Math.floor(Math.random() * possibilities.length);
    this.setState({
      timer: this.state.timeSetting,
      wordToDraw: possibilities[rand],
      canvasLoaded: false,
      activeRound: true,
    });
    console.log("start round:", this.state);
    this.startClock();
  };

  endRound = () => {
    let { players } = this.state;
    this.state.players.forEach((player, i) => {
      players[i].correctStatus = false;
    });
    this.setState({
      activeRound: false,
      players: players,
    });
    console.log("end round:", this.state);
    this.stopClock();
  };

  gameTick = () => {
    const {
      players,
      timer,
      timeSetting,
      currentRound,
      totalRounds,
      confidence,
      wordToDraw,
    } = this.state;
    this.setState({
      timer: (timer - 0.05).toFixed(2),
    });
    if (timer < 0 && currentRound === totalRounds) {
      this.endRound();
      console.log("Round over");
      this.setState({
        currentRound: 1,
      });
      return;
    }
    if (timer <= 0.0 && currentRound < totalRounds) {
      this.setState({
        currentRound: currentRound + 1,
      });
      this.endRound();
      this.beginRound();
      return;
    }
    players.forEach((player, i) => {
      if (!confidence[0]) return;
      if (
        player.correctStatus === false &&
        confidence[0].label === wordToDraw
      ) {
        let turnPoints = Math.floor((1000 * timer) / timeSetting);
        players[i].points += turnPoints;
        players[i].correctStatus === true;
        console.log(`${players[i].name} correct for ${turnPoints} points`);
      }
    });
    this.setState({
      players: players,
    });
  };

  startClock = () => {
    clock = setInterval(() => this.gameTick(), 50);
  };

  stopClock = () => {
    clearInterval(clock);
  };

  handleResults = (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    this.setState({
      confidence: result,
    });
  };

  guess = (input) => {
    nn.classify(input, this.handleResults);
  };

  mapPixels = (canvas) => {
    let pixelSums = [];
    let drawingData = [];
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        let pixelSum = 0;
        let pixelData = canvas.getImageData(j * 10, i * 10, 10, 10);
        for (let m = 0; m < pixelData.data.length; m++) {
          pixelSum += pixelData.data[m];
        }
        pixelSum -= 25500;
        pixelSums.push(pixelSum);
        let val = 255 - pixelSum / 300;
        drawingData.push(val / 255);
      }
    }
    this.guess(drawingData);
    return drawingData;
  };

  loadCanvasLogic = (mapPixels) => {
    const canvas = document.querySelector("#canvas");
    if (!canvas) return;
    if (this.state.canvasLoaded) return;
    context = canvas.getContext("2d");
    canvas.height = height;
    canvas.width = width;
    let drawing = false;
    const rect = canvas.getBoundingClientRect();
    clearCanvas(context);

    function startDraw(e) {
      drawing = true;
      if (undoing) {
        stack.push(context.getImageData(0, 0, height, width));
        undoing = false;
      }
      draw(e);
    }
    function stopDraw() {
      drawing = false;
      context.beginPath();
      stack.push(context.getImageData(0, 0, height, width));
    }

    function draw(e) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!drawing) return;
      context.lineWidth = 10;
      context.lineCap = "round";
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
      mapPixels(context);
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mousemove", draw);
    this.setState({
      canvasLoaded: true,
    });
  };
}
function clearCanvas(context) {
  for (let i = 0; i < 280; i++) {
    for (let j = 0; j < 280; j++) {
      drawPixel("white", context, i, j, 1);
    }
  }
  stack.push(context.getImageData(0, 0, 280, 280));
}

function drawPixel(color, context, x, y, size) {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
}

function finishLoad() {
  console.log("finished loading");
}

export default App;
