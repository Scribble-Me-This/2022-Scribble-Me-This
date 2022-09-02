const path = require("path");
const express = require("express");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const util = require('util')
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080/"],
  },
});
//https://socket.io/docs/v4/server-initialization/

const LobbyList = [];
const state = {};

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
  //generate a simple id for sharing
  const idGen = (length) => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
      settings: {
        gameId: lobbyId,
        leader: leaderId,
        gameSettings: {
          currentWord: "",
          wordArr: [],
          drawTime: 60,
          maxPlayers: 4,
          password: "",
        },
        gameViewLogic: {
          inGame: false,
          drawing: false,
          results: false,
        },
      }, 
    };
  }
  //logic
  //create lobby
  socket.on("newLobby", handleNewLobby);
  function handleNewLobby() {
    let lobbyId = idGen(5);
    LobbyList[socket.id] = lobbyId;
    state[lobbyId] = createState(lobbyId, socket.id);
    socket.join(lobbyId);
    console.log('all states here: ', state)
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
  socket.on("joinLobby", (lobbyId, client) => {
    const uppLobbyId = lobbyId.toUpperCase();
    if (LobbyList[socket.id] = [uppLobbyId]) {
      state[uppLobbyId].clients.push(client);
      console.log('joined lobby');
      //fix to send to clients in joined lobby
      io.emit("joinedLobby", state[uppLobbyId]);
    } else {
      console.log('join lobby failed', state[uppLobbyId]);
      io.to(socket.id).emit("joinedLobby", false);
    }
  });
  //toggle ready
  socket.on("toggleReady", (lobbyId) => {
    if (LobbyList[socket.id] = [lobbyId]) {
      const client = state[lobbyId].clients.find((client) => client.clientId === socket.id);
      client.readyCheck = !client.readyCheck;
      io.emit("lobbyUpdate", state[lobbyId]);
    } else {
      console.log('toggle ready failed');
    }
  })
  //Broadcast Ready Check
  socket.on("readyCheck", (lobbyId) => {
    if (LobbyList[socket.id] = [lobbyId]) {
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
        //game starts
        //fix to send to clients in joined lobby
        io.emit("gameStart", true);
      } else {
        io.to(socket.id).emit("gameStart", false);
      }
    }
  });
});
module.exports = httpServer;

// logging middleware
app.use(morgan("dev"));

// body parsing middleware
app.use(express.json());

// auth and api routes
app.use("/auth", require("./auth"));
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
