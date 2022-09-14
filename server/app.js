const path = require("path");
const express = require("express");
const morgan = require("morgan");
const util = require("util");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createPlayer, idGen, createState } = require("./socket.io/utils");
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

let timeOut = false;


const beginRound = (gameState, lobbyId) => {
  let { timeSetting, players } = gameState;
  let rand = Math.floor(Math.random() * possibilities.length);
  // gameState.players = players;
  gameState.timer = timeSetting;
  gameState.wordToDraw = possibilities[rand];
  gameState.activeRound = true;
  io.in(lobbyId).emit("beginRound", gameState);
};

const endRound = (gameState, lobbyId) => {
  let { players } = gameState;
  players.forEach((player) => {
    player.correctStatus = false;
    player.confidence = [];
  });
  gameState.activeRound = false;
  gameState.players = players;
  io.in(lobbyId).emit("endRound", gameState);
};

const gameTick = (gameState, lobbyId) => {
  let { timeSetting, timer, currentRound, totalRounds, wordToDraw, players } =
    gameState;
  gameState.timer = (timer - 0.1).toFixed(1);
  let unfinishedPlayers = players.filter((player) => !player.correctStatus);
  if (
    (gameState.timer <= 0 || unfinishedPlayers.length === 0) &&
    currentRound === totalRounds
  ) {
    if (gameState.timer <= 1) {
      endRound(gameState, lobbyId);
      io.in(lobbyId).emit("gameEnd", gameState);
      return;
    }
    if (!timeOut) {
      timeOut = true;
      console.log("set timeout");
      setTimeout(() => {
        endRound(gameState, lobbyId);
        io.in(lobbyId).emit("gameEnd", gameState);
        timeOut = false;
        return;
      }, 1000);
    }
  }
  if (
    (gameState.timer <= 0 || unfinishedPlayers.length === 0) &&
    currentRound < totalRounds
  ) {
    if (gameState.timer <= 1) {
      gameState.currentRound = currentRound + 1;
      endRound(gameState, lobbyId);
      beginRound(gameState, lobbyId);
      return;
    }

    if (!timeOut) {
      timeOut = true;
      console.log("set timeout");
      setTimeout(() => {
        gameState.currentRound = currentRound + 1;
        endRound(gameState, lobbyId);
        beginRound(gameState, lobbyId);
        timeOut = false;
        return;
      }, 1000);
    }
  }

  io.to(lobbyId).emit("gameTick", gameState);
};

let clock = null;
// if (!clock) {
  clock = setInterval(() => {
    for (const lobbyId in state) {
      console.log(lobbyId);
      if (state[lobbyId].gameState.activeRound) {
        gameTick(state[lobbyId].gameState, state[lobbyId].gameId);
      }
    }
    console.log("clock ticky wicky");
  }, 100);
// }

//nests socket.io logic on connection
io.on("connection", (socket) => {
  // Lobby utils *****************************************//
  const findLobby = (socketIdToFind) => {
    for (let i = 0; i < LobbyList.length; i++) {
      if (LobbyList[i][socketIdToFind]) {
        return LobbyList[i][socketIdToFind];
      }
    }
  };

  const checkConnect = (lobbyId) => {
    for (let i = 0; i < LobbyList.length; i++) {
      if (LobbyList[i][socket.id] === lobbyId) return true;
    }
    return false;
  };

  //reload page
  socket.on("reloadPage", () => {
    lobbyToChange = findLobby(socket.id);
    io.to(lobbyToChange).emit("reloadPage");
  });
  //send to home
  socket.on("sendToHome", () => {
    io.to(socket.id).emit("sendToHome");
  });

  // Game socket logic *****************************************//
  // if in a round, then:



  socket.on("playerUpdate", (player) => {
    let playerSocket = socket.id;
    let clientGameId = findLobby(playerSocket);
    state[clientGameId].gameState.players[player.playerId] = player;
  });

  //Socket lobby logic *****************************************//
  socket.on("newLobby", handleNewLobby);
  function handleNewLobby() {
    let lobbyId = idGen(5);
    let newClientRef = {};
    newClientRef[socket.id] = lobbyId;
    LobbyList.push(newClientRef);
    state[lobbyId] = createState(lobbyId, socket.id);
    socket.join(lobbyId);
    io.to(socket.id).emit("newLobby", state[lobbyId]);
  }
  //join lobby (leader)
  socket.on("initLobby", (lobbyId, client, gameState) => {
    const uppLobbyId = lobbyId.toUpperCase();
    if (checkConnect(uppLobbyId) && state[uppLobbyId]) {
      state[uppLobbyId].clients.push(client);
      let newPlayer = createPlayer(client);
      newPlayer.playerId = state[uppLobbyId].gameState.players.length;
      gameState.players.push(newPlayer);
      state[uppLobbyId].gameState = gameState;
      console.log("joined lobby");
      //fix to send to clients in joined lobby
      io.emit("joinedLobby", state[uppLobbyId]);
      io.to(socket.id).emit("playerId", newPlayer.playerId);
      console.log("socket.rooms on joined", util.inspect(socket.rooms));
    } else {
      console.log(
        "join lobby failed on",
        socket.id,
        "failed state:",
        state[uppLobbyId]
      );
      io.to(socket.id).emit("sendToHome");
    }
    console.log("State: ", state);
  });
  //join lobby (client)
  socket.on("joinLobby", (lobbyId, client) => {
    const uppLobbyId = lobbyId.toUpperCase();
    let newClientRef = {};
    newClientRef[socket.id] = uppLobbyId;
    LobbyList.push(newClientRef);
    if (checkConnect(uppLobbyId) && state[uppLobbyId]) {
      socket.join(uppLobbyId);
      state[uppLobbyId].clients.push(client);
      let newPlayer = createPlayer(client);
      newPlayer.playerId = state[uppLobbyId].gameState.players.length;
      state[uppLobbyId].gameState.players.push(newPlayer);
      console.log("joined lobby");
      io.emit("joinedLobby", state[uppLobbyId]);
      io.to(socket.id).emit("playerId", newPlayer.playerId);
      console.log("socket.rooms on joined", util.inspect(socket.rooms));
    } else {
      console.log("join lobby failed", state[uppLobbyId]);
      io.to(socket.id).emit("sendToHome");
    }
  });
  //leave lobby
  socket.on("leaveLobby", () => {
    let lobbyToLeave = findLobby(socket.id);
    socket.leave(lobbyToLeave);
    console.log(socket.id, "has left the lobby");
    io.to(socket.id).emit("leftLobby");
    console.log("socket.rooms", util.inspect(socket.rooms));
  });

  //view lobbies
  socket.on("viewLobbies", () => {
    let stateLobbies = [];
    for (let key in state) {
      stateLobbies.push(state[key]);
    }
    io.to(socket.id).emit("lobbies", stateLobbies);
  });

  //get rules
  socket.on("getRules", () => {
    lobbyToChange = findLobby(socket.id);
    let thisClient = {};
    if (checkConnect(lobbyToChange) && state[lobbyToChange]) {
      for (let i = 0; i < state[lobbyToChange].clients.length; i++) {
        if (state[lobbyToChange].clients[i].clientId === socket.id) {
          thisClient = state[lobbyToChange].clients[i];
        }
      }
      io.to(lobbyToChange).emit("rulesUpdate", {
        lobbyName: state[lobbyToChange].lobbyName,
        username: thisClient.username,
        gameMode: state[lobbyToChange].gameMode,
        maxPlayers: state[lobbyToChange].gameState.maxPlayers,
        timeSetting: state[lobbyToChange].gameState.timeSetting,
        totalRounds: state[lobbyToChange].gameState.totalRounds,
      });
    } else io.to(socket.id).emit("sendToHome");
  });

  //update rules
  socket.on("updateRules", (newState) => {
    ({ lobbyName, username, gameMode, totalRounds, maxPlayers, timeSetting } =
      newState);
    lobbyToChange = findLobby(socket.id);
    let thisClient = {};
    if (checkConnect(lobbyToChange) && state[lobbyToChange]) {
      for (let i = 0; i < state[lobbyToChange].clients.length; i++) {
        if (state[lobbyToChange].clients[i].clientId === socket.id) {
          thisClient = state[lobbyToChange].clients[i];
        }
      }
      state[lobbyToChange].lobbyName = lobbyName;
      state[lobbyToChange].gameMode = gameMode;
      state[lobbyToChange].gameState.maxPlayers = maxPlayers;
      state[lobbyToChange].gameState.timeSetting = timeSetting;
      state[lobbyToChange].gameState.totalRounds = totalRounds;
      thisClient.username = username;
      io.to(lobbyToChange).emit("rulesUpdate", {
        lobbyName: state[lobbyToChange].lobbyName,
        username: thisClient.username,
        gameMode: state[lobbyToChange].gameMode,
        maxPlayers: state[lobbyToChange].gameState.maxPlayers,
        timeSetting: state[lobbyToChange].gameState.timeSetting,
        totalRounds: state[lobbyToChange].gameState.totalRounds,
      });
    } else {
      console.log("rule change fail");
      io.to(socket.id).emit("sendToHome");
    }
  });

  //Toggle ready checks
  socket.on("toggleReady", (lobbyId) => {
    const uppLobbyId = lobbyId.toUpperCase();
    if (checkConnect(uppLobbyId) && state[uppLobbyId]) {
      const client = state[lobbyId].clients.find(
        (client) => client.clientId === socket.id
      );
      client.readyCheck = !client.readyCheck;
      io.to(uppLobbyId).emit("lobbyUpdate", state[lobbyId]);
    } else {
      console.log("toggle ready failed");
    }
  });

  //Broadcast Ready Check
  socket.on("readyCheck", (lobbyId) => {
    const uppLobbyId = lobbyId.toUpperCase();
    if (checkConnect(uppLobbyId) && state[uppLobbyId]) {
      let readyPlayers = [];
      let notReadyPlayers = [];
      for (let i = 0; i < state[uppLobbyId].clients.length; i++) {
        let currentUser = state[uppLobbyId].clients[i];
        if (currentUser.readyCheck === true) {
          console.log(currentUser.username + " is ready");
          readyPlayers.push(currentUser.username);
        } else {
          console.log(currentUser.username + " is not ready");
          notReadyPlayers.push(currentUser.username);
        }
      }
      if (readyPlayers.length === state[uppLobbyId].clients.length) {
        const gameState = state[uppLobbyId].gameState;
        beginRound(gameState, uppLobbyId);
      } else {
        console.log("not all players are ready");
      }
    }
  });
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
