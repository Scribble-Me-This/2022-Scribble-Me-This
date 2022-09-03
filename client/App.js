import Navbar from "./components/Navbar";
import React from "react";
import ml5 from "ml5";
import socket from "./client.js";
import {
  Canvas,
  Confidence,
  Player,
  PlayersDisplay,
  possibilities,
} from "./components";
import Routes from "./Routes";
import { connect } from "react-redux";

let clock;
let context;
let stack = [];
let undoing = [false];
const height = 280;
const width = 280;

socket.on("connect", () => {
  console.log("Client connected: client same level", socket);
socket.on('connect', () => {
  console.log('Client connected: App.js', socket);
});
})


const options = {
  task: 'classification',
  debug: false,
};

const nn = ml5.neuralNetwork(options);

const modelDetails = {
  model: './model.json',
  metadata: './model_meta.json',
  weights: './model.weights.bin',
};

nn.load(modelDetails, () => console.log('Neural Net Loaded'));

let player1 = new Player('Host', 0, null, null, false, [], false);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timer: null, // MOVE
      wordToDraw: "", // MOVE
      players: [player1], // MOVE
      activeRound: false, // MOVE
      totalRounds: 5, // MOVE
      currentRound: 1, // MOVE
      timeSetting: 15,
      timer: null,
      lobbyInstance: {},
      gameSettings: {
        timeSetting: 0,
      },
    };
    this.setState = this.setState.bind(this)
    this.socket = socket;
  }

  componentDidMount() {
    this.socket.on('gameStart', (bool) => {
      if (bool) {
        setTimeout(() => {
          this.beginRound();
        }, 3000);
      } else {
        return;
      }
    });
    this.socket.on("initGame", (masterSettings) => {
      this.setState({
        gameSettings: masterSettings,
      });
    });
    //this.socket.on('endRound', EXAMPLE);
  }

  pencilClick() {
    let audio = new Audio('/pencil.mp3');
    audio.play();
  }

  penClick() {
    let audio = new Audio('/pen_click.mp3');
    audio.play();
  }

  lobbyInstanceUpdater = (newlobbyInstance) => {
    this.setState({ lobbyInstance: newlobbyInstance });
  };

  render() {
    const timeSetting = this.state.gameSettings.timeSetting || 0;
    const {
      wordToDraw,
      activeRound,
      timer,
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
                  this.pencilClick();
                  this.endRound();
                }}
              >
                End
              </button>
              <div className='column'>
                <div className='instanceStats'>
                  <h3> Time: {timer} </h3>
                  <h3>
                    {' '}
                    Round: {currentRound} / {totalRounds}{' '}
                  </h3>
                  <h3> Drawing: {wordToDraw} </h3>
                </div>
                <div className='canvasEtc'>
                  <Confidence confidence={players[0].confidence} />
                  <Canvas 
                  id="canvas" 
                  clearCanvas={clearCanvas} 
                  mapPixels={this.mapPixels} 
                  drawPixel={drawPixel} context={context} stack={stack} undoing={undoing} undo={undo}/>
                  {this.loadCanvasLogic(this.mapPixels, this.state, this.setState)}

                  <PlayersDisplay
                    players={players}
                    confidence={players[0].confidence}
                    wordToDraw={wordToDraw}
                    drawingData={players[0].drawingData}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Routes lobbyInstanceUpdater={this.lobbyInstanceUpdater} />
            </div>
          )}
        </div>
      </div>
    );
  }

  beginRound = () => {
    const timeSetting = this.state.gameSettings.timeSetting || 0;
    const players = this.state.players;
    let rand = Math.floor(Math.random() * possibilities.length);
    stack = [];
    players[0].canvasLoaded = false;
    this.setState({
      timer: timeSetting,
      wordToDraw: possibilities[rand],
      players: players,
      activeRound: true,
    });
    console.log('start round:', this.state);
    //socket.emit('startRound', EXAMPLE);
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
    console.log('end round:', this.state);
    this.stopClock();
  };

  gameTick = () => {
    const timeSetting = this.state.gameSettings.timeSetting || 0;
    const {
      players,
      timer,
      currentRound,
      totalRounds,
      wordToDraw,
    } = this.state;
    this.setState({
      //reduce timer by .05 seconds
      timer: (timer - 0.05).toFixed(2),
    });
    //if time is out and it's the last round
    if (timer <= 0 && currentRound === totalRounds) {
      // end the round
      // some after-game logic we haven't made yet
      this.endRound();
      console.log('Round over');
      this.setState({
        currentRound: 1,
      });
      return;
    }
    //if time is out and it's not the last round
    if (timer <= 0.0 && currentRound < totalRounds) {
      // increase round count by one, end the round and begin a round
      this.setState({
        currentRound: currentRound + 1,
      });
      this.endRound();
      this.beginRound();
      return;
    }
    //if time is proceeding
    players.forEach((player, i) => {
      //if player's top confidence is the correct word AND correctStatus is false, give points and set correctStatus to true
      if (!player.confidence[0]) return;
      if (
        player.correctStatus === false &&
        player.confidence[0].label === wordToDraw
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

  guess = (input) => {
    nn.classify(input, this.handleResults);
  };

  handleResults = (error, result) => {
    const {players} = this.state;
    if (error) {
      console.error(error);
      return;
    }
    players[0].confidence = result;
    this.setState({
      players: players
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
    if (this.state.players[0].canvasLoaded) return;
    context = canvas.getContext('2d');
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
      let {players} = state;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!drawing) return;
      context.lineWidth = 10;
      context.lineCap = 'round';
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
      players[0].drawingData = mapPixels(context);
      updateState({
        players: players,
      })
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mousemove', draw);
    const players = state.players;
    players[0].canvasLoaded = true;
    this.setState({
      players: players,
    });
  };
}
function clearCanvas(context, mapPixels) {
  for (let i = 0; i < 280; i++) {
    for (let j = 0; j < 280; j++) {
      drawPixel('white', context, i, j, 1);
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
