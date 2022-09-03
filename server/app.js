const path = require("path");
const express = require("express");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080/"],
  },
});
//https://socket.io/docs/v4/server-initialization/

const LobbyList = [];
const state = {};
const possibilities = [
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

function createPlayer(client) {
  return {
    name: client.username,
    // id = socket id
    id: client.clientId,
    points: 0,
    drawingData: [],
    topGuess: null,
    correctStatus: false,
    confidence: [],
    canvasLoaded: false,
  };
}

//generate a simple id for sharing
const idGen = (length) => {
  let result = "";
  let characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
//initialize state

function createState(lobbyId, leaderId) {
  return {
    gameMode: "ScribbleMeThisClassic",
    clients: [],
    gameState: {
      timeSetting: 15,
      players: [],
      timer: 15,
      currentRound: 1,
      totalRounds: 5,
      wordToDraw: "",
      maxPlayers: 4,
      password: "",
    },
    gameId: lobbyId,
    leader: leaderId,
    settings: {
      gameViewLogic: {
        inGame: false,
        drawing: false,
        results: false,
      },
    },
  };
}

io.on("connection", (socket) => {
  // console.log(`Socket: ${util.inspect(socket)} has connected`);
  //utils
  const findLobby = (lobbyId) => {
    const uppLobbyId = lobbyId.toUpperCase();
    for (let socketId in LobbyList) {
      if (LobbyList[socketId].lobbyId === uppLobbyId) {
        return LobbyList[socketId];
      }
    }
    return alert("Lobby not found");
  };

  let clock; 
  
  const beginRound = (gameState) => {
    let { timeSetting, players } = gameState;
    console.log("beginRound gameState in", gameState);
    let rand = Math.floor(Math.random() * possibilities.length);
    players.forEach((player) => (player.canvasLoaded = false));
    gameState.players = players;
    gameState.timer = timeSetting;
    gameState.wordToDraw = possibilities[rand];
    gameState.activeRound = true;
    console.log("beginRound gameState out", gameState);
    socket.emit("beginRound", gameState);
    startClock(gameState);
  };

  const endRound = (gameState) => {
    let { players } = gameState;
    console.log("endRound gameState in", gameState);
    players.forEach((player) => {
      player.correctStatus = false;
    });
    gameState.activeRound = false;
    gameState.players = players;
    console.log("endRound gameState out", gameState);
    socket.emit("endRound", gameState);
    stopClock();
  };

  const gameTick = (gameState) => {
    console.log("gameTick gameState in", gameState);
    let { timeSetting, timer, currentRound, totalRounds, wordToDraw, players } =
      gameState;
    gameState.timer = (timer - 0.05).toFixed(2);

    if (gameState.timer <= 0 && currentRound === totalRounds) {
      endRound(gameState);
      // some after-game logic we haven't made yet
      return;
    }

    if (gameState.timer <= 0.0 && currentRound < totalRounds) {
      gameState.currentRound = currentRound + 1;
      endRound(gameState);
      beginRound(gameState);
      return;
    }

    players.forEach((player, i) => {
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
    gameState.players = players;
    console.log("gameTick gameState out", gameState);
    socket.emit("gameTick", gameState);
  };

  //logic
  //create lobby
  socket.on("newLobby", handleNewLobby);
  function handleNewLobby() {
    let lobbyId = idGen(5);
    LobbyList[socket.id] = lobbyId;
    state[lobbyId] = createState(lobbyId, socket.id);
    socket.join(lobbyId);
    console.log("all states here: ", state);
    io.to(socket.id).emit("newLobby", state[lobbyId]);
  }
  //update lobby
  socket.on("updateLobby", (newState) => {
    state[gameId] = newState;
    io.to(gameId).emit("lobbyUpdate", newState);
  });
  //view lobbies
  socket.on("viewLobbies", handleViewLobbies);
  function handleViewLobbies() {
    console.log("viewLobbies", LobbyList);
    io.to(socket.id).emit("lobbies", LobbyList);
  }
  //join lobby
  socket.on("joinLobby", (lobbyId, client, gameState) => {
    const uppLobbyId = lobbyId.toUpperCase();
    if ((LobbyList[socket.id] = [uppLobbyId])) {
      state[uppLobbyId].clients.push(client);
      let newPlayer = createPlayer(client);
      gameState.players.push(newPlayer);
      console.log("joined lobby");
      //fix to send to clients in joined lobby
      io.emit("joinedLobby", state[uppLobbyId]);
    } else {
      console.log("join lobby failed", state[uppLobbyId]);
      io.to(socket.id).emit("joinedLobby", false);
    }
  });
  //toggle ready
  socket.on("toggleReady", (lobbyId) => {
    if ((LobbyList[socket.id] = [lobbyId])) {
      const client = state[lobbyId].clients.find(
        (client) => client.clientId === socket.id
      );
      client.readyCheck = !client.readyCheck;
      io.emit("lobbyUpdate", state[lobbyId]);
    } else {
      console.log("toggle ready failed");
    }
  });
  //Broadcast Ready Check
  socket.on("readyCheck", (lobbyId) => {
    if ((LobbyList[socket.id] = [lobbyId])) {
      let readyPlayers = [];
      let notReadyPlayers = [];
      for (let i = 0; i < state[lobbyId].clients.length; i++) {
        let currentUser = state[lobbyId].clients[i];
        if (currentUser.readyCheck === true) {
          console.log(currentUser.username + " is ready");
          readyPlayers.push(currentUser.username);
        } else {
          console.log(currentUser.username + " is not ready");
          notReadyPlayers.push(currentUser.username);
        }
      }
      if (readyPlayers.length === state[lobbyId].clients.length) {
        const gameState = state[lobbyId].gameState;
        //game starts
        //fix to send to clients in joined lobby
        beginRound(gameState);
      } else {
        io.to(socket.id).emit("gameStart", false);
      }
    }
  });

  startClock = (gameState) => {
    clock = setInterval(() => gameTick(gameState), 50);
  };
  
  stopClock = () => {
    clearInterval(clock);
  };
});
module.exports = httpServer;

// logging middleware
app.use(morgan("dev"));

// body parsing middleware
app.use(express.json());

// api route
app.use("/api", require("./api"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public/index.html"))
);

// static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "public")));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});


