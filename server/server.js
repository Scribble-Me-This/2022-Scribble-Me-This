const { emit } = require('nodemon');

const io = require('socket.io')(8081, {
  cors: {
    origin: ['https://scribblemethis.io/'],
  },
});

//maps socket.id to a lobbyId ('dsjbfaujfgdbjak': 'XDG4W')
//allows easy lookup
const LobbyList = {};
const state = {};

io.on('connection', (socket) => {
  console.log(`Socket: ${socket} has connected`);

  //*********Game lobby********* all lives in io.on connection//
  //utils
  //allows lookup of socket.id via lobbyId
  const findLobby = (lobbyId) => {
    const uppLobbyId = lobbyId.toUpperCase();
    for (let socketId in LobbyList) {
      if (LobbyList[socketId].lobbyId === uppLobbyId) {
        return LobbyList[socketId];
      }
    }
    return alert('Lobby not found');
  };
  //generate a simple id for sharing
  const idGen = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  //initialize state
  function createState(lobbyId, leaderId) {
    return {
      gameMode: 'ScribbleMeThisClassic',
      clients: [],
      settings: {
        gameId: lobbyId,
        leader: leaderId,
        gameSettings: {
          currentWord: '',
          wordArr: [],
          drawTime: 60,
          maxPlayers: 4,
          password: '',
        },
        gameState: {
          inGame: false,
          drawing: false,
          results: false,
        },
      },
    };
  }

  //Create lobby
  /* 'response', {Method: 'CreateLobby', game: {settings like game id and settings} } */
  socket.on('newLobby', handleNewLobby);
  function handleNewLobby() {
    let lobbyId = idGen(5);
    LobbyList[socket.id] = lobbyId;
    state[lobbyId] = createState(lobbyId, socket.id);
    //state[lobbyId].clients.push(client);
    socket.join(lobbyId);
    io.to(socket.id).emit('newLobby', lobbyId);
  }
  //Update lobby Reciever
  /* 'response', {Method: 'UpdateLobby', game: {new settings} } 
this goes out to all connected clients*/
  socket.on('updateLobby', { state }, { client });

  //View lobbies
  /* 'request', {Method: 'viewLobbies'}
gives a list of all lobbies on request
*/
  socket.on('viewLobbies', handleViewLobbies);
  function handleViewLobbies() {
    io.to(socket.id).emit('lobbies', LobbyList);
  }

  //Join lobby
  /* 'response', {Method: 'CreateLobby', {game: {settings}, clients: [arr of players]} } */
  socket.on('joinLobby', ((lobbyId, client), handleJoinLobby));
  function handleJoinLobby(lobbyId) {
    const lobby = findLobby(lobbyId);
    if (LobbyList[socket.id][lobbyId]) {
      state[lobbyId].clients.push(client);
      io.to(socket.id).emit('joinedLobby', true);
    } else {
      io.to(socket.id).emit('joinedLobby', false);
    }
  }
  //Broadcast Ready Check
  socket.on('readyCheck', handleReadyCheck);
  function handleReadyCheck(lobbyId) {
    if (LobbyList[socket.id][lobbyId]) {
      let readyPlayers = [];
      let notReadyPlayers = [];
      for (let i = 0; i < state[lobbyId].clients.length; i++) {
        let currentUser = state[lobbyId].clients[i];
        if (currentUser.readyCheck === true) {
          console.log(currentUser.username + ' is ready');
          readyPlayers.push(currentUser.username);
        } else {
          console.log(currentUser.username + ' is not ready');
          notReadyPlayers.push(currentUser.username);
        }
      }
      if (readyPlayers.length === state[lobbyId].clients.length) {
        io.to(socket.id).emit('readyCheck', true);
      } else {
        io.to(socket.id).emit('readyCheck', false);
      }
    }
  }
});
//*********Game mode ScribbleMeThisClassic*********//

//send package to clients (game state/ timings)
// let state = {
//   gameMode: 'ScribbleMeThisClassic',
//   clients: [],
//   settings: {
//     gameId: '5char',
//     gameSettings: {
//       currentWord: '',
//       wordArr: [],
//       drawTime: 60,
//       maxPlayers: 4,
//       password: '',
//     },
//     gameState: {
//       inGame: false,
//       drawing: false,
//       results: false,
//     }
//   }
// }

//comes from client then gets mapped to game state client array
// let client = {
//   clientName: '',
//   clientId: '',
//   guessed: false,
//   previewPic: canvas,
//   bestGuess: '',
//   confidence: [],
//   score: 0,
// }
//init package has the word to scribble

//recevies AI pred from players and updates game state

//*********Game mode Scribblio*********//

//**Server emits drawing data from drawer to other clients and AI player
//**Server runs AI player
