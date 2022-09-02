import Navbar from "./components/Navbar";
import React from "react";
import ml5 from "ml5";
import socket from "./client.js";
import { Canvas, Confidence, Player, PlayersDisplay, possibilities } from "./components";
import Routes from "./Routes";
import { connect } from "react-redux";


socket.on("connect", () => {
  console.log("Client connected: App.js", socket);
});

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

nn.load(modelDetails, (() => console.log("Neural Net Loaded")));

let player1 = new Player("Host", 0, null, null, false);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // timeSetting: 15,  // MOVE
      timer: null,    // MOVE
      wordToDraw: "",     // MOVE
      players: [player1],   // MOVE
      activeRound: false,    // MOVE
      totalRounds: 5,     // MOVE
      currentRound: 1,     // MOVE
      confidence: [],
      canvasLoaded: false,
      lobbyInstance: {},
      gameState: {
        game: {
          clients: [],
          settings: {
            gameId: "",
            gameSettings: {
              timeSetting: 0
            }
          },
        },
      },
    };
    this.socket = socket;
  }

  componentDidMount() {
    this.socket.on("gameStart", (bool) => {
      if (bool) {
        setTimeout(() => {
          this.beginRound();
        }, 3000);
      } else {
        return;
      }
    });
  }

  lobbyInstanceUpdater = (newlobbyInstance) => {
    this.setState({ lobbyInstance: newlobbyInstance });
  }

  render() {
    const timeSetting = this.state.gameState.game.settings.gameSettings.timeSetting || 15;
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
                  <Confidence confidence={confidence} />
                  <Canvas id="canvas" clearCanvas={clearCanvas} drawPixel={drawPixel} context={context}/>
                  {this.loadCanvasLogic(this.mapPixels)}
                  <PlayersDisplay
                    players={players}
                    confidence={confidence}
                    wordToDraw={wordToDraw}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
            <Routes lobbyInstanceUpdater={this.lobbyInstanceUpdater}/>
          </div>
          )}
        </div>
      </div>
    );
  }

  beginRound = () => {
    const timeSetting = this.state.gameState.game.settings.gameSettings.timeSetting || 15;

    let rand = Math.floor(Math.random() * possibilities.length);
    this.setState({
      timer: timeSetting,
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
    const timeSetting = this.state.gameState.game.settings.gameSettings.timeSetting || 15;
    const {
      players,
      timer,
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
        let turnPoints = 500 + Math.floor((500 * timer) / timeSetting);
        players[i].points += turnPoints;
        players[i].correctStatus = true;
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

// ~~~~~~~~~~~~~~~~~~~~~~
// ~~~~ CANVAS LOGIC ~~~~
// ~~~~~~~~~~~~~~~~~~~~~~

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

const mapState = (state) => {
  return {
    gameState: state.gameState,
    clientState: state.clientState,
  };
};

const mapDispatch = (dispatch) => {
  return {
    // explicitly forwarding arguments
  };
};


export default connect(mapState, mapDispatch)(App);