import Navbar from "./components/Navbar";
import React from "react";
import ml5 from "ml5";
import socket from "./client.js";
import { getGameState } from "./store/gameState";
import { getClientState } from "./store/clientState";
import {
  Canvas,
  Confidence,
  Player,
  PlayersDisplay,
  possibilities,
} from "./components";
import Routes from "./Routes";
import { connect } from "react-redux";

let idStore;
let clock;
let context;
let stack = [];
let undoing = [false];
let canvasLoaded = false;
const height = 280;
const width = 280;

socket.on("connect", () => {
  console.log("Client connected: client same level", socket);
  socket.on("connect", () => {
    console.log("Client connected: App.js", socket);
  });
});

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

nn.load(modelDetails, () => console.log("Neural Net Loaded"));

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timeSetting: 0,
      players: [],
      timer: 0,
      currentRound: 1,
      totalRounds: 5,
      wordToDraw: "",
      activeRound: false,
      playerId: 0,
    };
    this.setState = this.setState.bind(this);
    this.socket = socket;
  }

  componentDidMount() {
    console.log(this.props);
    socket.on("beginRound", (gameState) => {
      this.props.updateGameState(gameState);
      this.setState(gameState);
    });
    socket.on("endRound", (gameState) => {
      canvasLoaded = false;
      this.props.updateGameState(gameState);
      this.setState(gameState);
    });
    socket.on("gameTick", (gameState) => {
      // this.props.updateGameState(gameState);
      this.setState(gameState);
      // this.setState({...this.state, ...gameState});
      // this.state = gameState;
      console.log("tick gameState", gameState);
      console.log("this.state", this.state);
    });
    socket.on("playerId", (id) => {"appjs socket console log", idStore = id});
  }

  componentDidUpdate() {
    console.log("COMPONENT DID UPDATE")
  }

  pencilClick() {
    let audio = new Audio("/pencil.mp3");
    audio.play();
  }

  penClick() {
    let audio = new Audio("/pen_click.mp3");
    audio.play();
  }

  render() {
    const {
      wordToDraw,
      activeRound,
      timer,
      currentRound,
      totalRounds,
      players,
    } = this.state;
    const playerId = this.state.playerId || 0;
    return (
      <div>
        <Navbar />
        <div>
          {activeRound ? (
            <div>
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
                  <Confidence
                    confidence={
                      players[playerId] ? players[playerId].confidence : []
                    }
                  />
                  <Canvas
                    id="canvas"
                    clearCanvas={clearCanvas}
                    mapPixels={this.mapPixels}
                    drawPixel={drawPixel}
                    context={context}
                    stack={stack}
                    undoing={undoing}
                    undo={undo}
                  />
                  {this.loadCanvasLogic(
                    this.mapPixels,
                    this.state,
                    this.setState
                  )}

                  <PlayersDisplay
                    players={players}
                    confidence={
                      players[playerId] ? players[playerId].confidence : []
                    }
                    wordToDraw={wordToDraw}
                    drawingData={
                      players[playerId] ? players[playerId].drawingData : []
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  this.pencilClick();
                  this.endRound();
                }}
              >
                End
              </button>
            </div>
          ) : (
            <div>
              <Routes />
            </div>
          )}
        </div>
      </div>
    );
  }

  guess = (input) => {
    nn.classify(input, this.handleResults);
  };

  handleResults = (error, result) => {
    const { players, playerId } = this.state;
    playerId = 0;
    if (error) {
      console.error(error);
      return;
    }
    players[playerId].confidence = result;
    this.setState({
      players: players,
    });
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

  loadCanvasLogic = (mapPixels, state, updateState) => {
    const canvas = document.querySelector("#canvas");
    if (!canvas) return;
    if (!this.state.players[0]) return;
    if (canvasLoaded) return;
    context = canvas.getContext("2d");
    canvas.height = height;
    canvas.width = width;
    let drawing = false;
    const rect = canvas.getBoundingClientRect();
    clearCanvas(context, this.mapPixels);

    function startDraw(e) {
      drawing = true;
      if (undoing[0]) {
        stack.push(context.getImageData(0, 0, height, width));
        undoing[0] = false;
      }
      draw(e);
    }
    function stopDraw() {
      drawing = false;
      context.beginPath();
      stack.push(context.getImageData(0, 0, height, width));
    }

    function draw(e) {
      let playerId = 0
      let { players } = state;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!drawing) return;
      context.lineWidth = 10;
      context.lineCap = "round";
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
      players[playerId].drawingData = mapPixels(context);
      updateState({
        players: players,
      });
      socket.emit("clientUpdate", state);
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mousemove", draw);
    canvasLoaded = true;
  };
}
function clearCanvas(context, mapPixels) {
  for (let i = 0; i < 280; i++) {
    for (let j = 0; j < 280; j++) {
      drawPixel("white", context, i, j, 1);
    }
  }
  stack.push(context.getImageData(0, 0, 280, 280));
  mapPixels(context);
}

function drawPixel(color, context, x, y, size) {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
}

function undo(context, stack, undoing) {
  if (!stack.length) return;
  if (!undoing[0]) {
    undoing[0] = true;
    stack.pop();
  }
  context.putImageData(stack.pop(), 0, 0);
}

const mapState = (state) => {
  console.log("mapstate state", state);
  return {
    gameState: state.gameState,
  };
};

const mapDispatch = (dispatch) => {
  return {
    updateGameState: (lobbyState) => dispatch(getGameState(lobbyState)),
    updateClientState: (clientState) => dispatch(getClientState(clientState)),
  };
};

export default connect(mapState, mapDispatch)(App);
