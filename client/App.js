import Navbar from './components/Navbar';
import React from 'react';
import ml5 from 'ml5';
import socket from './client.js';
import { Canvas, Confidence, PlayersDisplay, GameResults } from './components';
import Routes from './Routes';
import { connect } from 'react-redux';
import Footer from './components/Footer';
import Tut from './components/Music';

let context;
let stack = [];
let undoing = [false];
let canvasLoaded = false;
const height = 280;
const width = 280;
let listenersLoaded = false;
const modelFolder= "30at1000"

socket.on('connect', () => {
  console.log('Client connected: client same level', socket);
  socket.on('connect', () => {
    console.log('Client connected: App.js', socket);
  });
});

socket.on("sendToHome", () => {
  window.location.href = "/";
  alert("Something went wrong. Please try again.");
});

socket.on("leftLobby", () => {
  window.location.href = "/";
  alert("Thank you for playing!");
});

const options = {
  task: 'classification',
  debug: false,
};

const nn = ml5.neuralNetwork(options);

const modelDetails = {
  model: `./models/${modelFolder}/model.json`,
  metadata: `./models/${modelFolder}/model_meta.json`,
  weights: `./models/${modelFolder}/model.weights.bin`,
};

nn.load(modelDetails, () => console.log('Neural Net Loaded'));

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timeSetting: 0,
      players: [],
      timer: null,
      currentRound: 1,
      totalRounds: 5,
      wordToDraw: '',
      playerId: null,
      activeRound: false,
      gameEnd: false,
    };
    this.setState = this.setState.bind(this);
    this.socketListeners = this.socketListeners.bind(this);
    this.socket = socket;
  }

  socketListeners() {
    if (listenersLoaded) {
      return;
    }
    console.log('socket listeners loaded');
    listenersLoaded = true;
    socket.on('beginRound', (gameState) => {
      console.log('beginRound');
      this.setState(gameState);
      this.setState({ gameEnd: false });
      this.forceUpdate();
    });
    socket.on('endRound', (gameState) => {
      console.log('endRound');
      canvasLoaded = false;
      this.setState(gameState);
      this.setState({ activeRound: true });
      this.setState({ gameEnd: true });
      this.forceUpdate();
    });
    socket.on('gameTick', (gameState) => {
      this.state.timeSetting = gameState.timeSetting;
      this.state.players = gameState.players;
      this.state.timer = gameState.timer;
      this.state.currentRound = gameState.currentRound;
      this.state.totalRounds = gameState.totalRounds;
      this.state.wordToDraw = gameState.wordToDraw;
      this.state.activeRound = gameState.activeRound;
      console.log('gameTick', gameState);
      if (gameState.timer <= -1) {
        canvasLoaded = false;
        this.setState(gameState);
        this.setState({ activeRound: true });
        this.setState({ gameEnd: true });
      }
      this.forceUpdate();
    });
    socket.on('playerId', (playerId) => {
      this.state.playerId = playerId;
      console.log('player ID state ', this.state);
    });
    socket.on('gameEnd', (this.gameEnd = true));
  }

  componentDidMount() {
    this.socketListeners();
  }

  componentDidUpdate() {
    this.socketListeners();
  }

  pencilClick() {
    let audio = new Audio('/pencil.mp3');
    audio.play();
  }

  penClick() {
    let audio = new Audio('/pen_click.mp3');
    audio.play();
  }

  render() {
    const timeSetting = this.state.timeSetting || 0;
    const {
      wordToDraw,
      activeRound,
      timer,
      currentRound,
      totalRounds,
      players,
      playerId,
      gameEnd,
    } = this.state;
    return (
      <div>
        <Navbar />
        <Tut />
        {gameEnd ? (
          <div>
          <GameResults players={players} socket={socket} />
          <button onClick={() => {
            this.setState({gameEnd : false})
            this.setState({activeRound : false})
          }}> Return to Lobby </button>
          </div>        ) : (
          <div>
            {activeRound ? (
              <div>
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
                    <Confidence
                      confidence={
                        players[playerId] ? players[playerId].confidence : []
                      }
                      wordToDraw={wordToDraw}
                    />
                    <Canvas
                      id='canvas'
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
                      this.setState,
                      this.forceUpdate,
                      stack
                    )}

                    <PlayersDisplay players={players} wordToDraw={wordToDraw} />
                  </div>
                </div>
                <button
                  className='canvas-button'
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
        )}
        <Footer />
      </div>
    );
  }

  guess = (input) => {
    nn.classify(input, this.handleResults);
  };

  handleResults = (error, result) => {
    const { players, playerId } = this.state;
    if (error) {
      console.error(error);
      return;
    }
    this.state.players[playerId].confidence = result;
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

  loadCanvasLogic = (mapPixels, state, updateState, forceUpdate, stack) => {
    const playerId = this.state.playerId;
    const canvas = document.querySelector('#canvas');
    if (!canvas) return;
    if (!this.state.players[playerId]) return;
    if (canvasLoaded) return;
    context = canvas.getContext('2d');
    canvas.height = height;
    canvas.width = width;
    let drawing = false;
    const rect = canvas.getBoundingClientRect();
    clearCanvas(context, this.mapPixels, stack);

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
      const { players, wordToDraw, timer, timeSetting } = state;
      let player = players[playerId];
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!drawing) return;
      context.lineWidth = 10;
      context.lineCap = 'round';
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
      player.drawingData = mapPixels(context);

      if (!player.confidence[0]) return;
      if (
        player.correctStatus === false &&
        player.confidence[0].label === wordToDraw
      ) {
        let turnPoints = 500 + Math.floor((500 * timer) / timeSetting);
        player.points += turnPoints;
        player.correctStatus = true;
      }

      state.players[playerId] = player;
      socket.emit('playerUpdate', player);
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mousemove', draw);
    canvasLoaded = true;
  };
}
function clearCanvas(context, mapPixels, stack) {
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
