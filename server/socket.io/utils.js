//creates player from client
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
  };
}

//generate a simple id for sharing
const idGen = (length) => {
  let lobbyId = "";
  let characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    lobbyId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return lobbyId;
};

//initialize state
function createState(lobbyId, leaderId) {
  return {
    gameMode: "ScribbleMeThisClassic",
    clients: [],
    lobbyName: "",
    gameState: {
      timeSetting: 15,
      players: [],
      timer: 15,
      currentRound: 1,
      totalRounds: 5,
      wordToDraw: "",
      password: "",
      activeRound: false,
      maxPlayers: 4,
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

module.exports = {
  createPlayer,
  idGen,
  createState,
}