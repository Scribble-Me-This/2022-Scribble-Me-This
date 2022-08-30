const socket = io("http://localhost:8081");

//controls how often the server sends a heartbeat to the client
const updateRate = 1000;

//*********Game lobby*********//
let client = {
  username: "",
  clientId: "",
  readyCheck: false,
  guessed: false,
  previewPic: canvas,
  bestGuess: "",
  confidence: [],
  score: 0,
};
//View lobbies
/* 'request', {Method: 'CreateLobby', clientId: 'leader' } 
gets list of all lobbies
*/
const viewLobbies = document.getElementById("viewLobbyButton");
createLobbyButton.addEventListener("click", () => {
  socket.emit("viewLobbies");
  //change to lobby view
});

//Create lobby
/* 'request', {Method: 'CreateLobby', clientId: 'leader' } 
whoever creates the lobby is the leader, and the leader also joins the lobby
*/
const createLobbyButton = document.getElementById("createLobbyButton");
createLobbyButton.addEventListener("click", () => {
  socket.emit("newLobby", { "client.id": client.id });
});
//return request
socket.on("newLobby", (lobbyId) => {
  console.log("newLobby", lobbyId);
});

//Update lobby Request
/* 'request', {Method: 'UpdateLobby', {clientId: 'test' , game: lobbyid and setting} } */
const updateLobbyButton = document.getElementById("updateLobbyButton");
updateLobbyButton.addEventListener("click", () => {
  socket.emit("updateLobby", {
    gameMode: "ScribbleMeThisClassic",
    clients: [],
    settings: {
      gameId: "",
      gameSettings: {
        word: "",
        drawTime: 60,
        guessInterval: 10,
        mayPlayers: 4,
        password: "",
      },
      gameState: {
        inGame: false,
        drawing: false,
        results: false,
      },
    },
  });
});

socket.on("lobbyUpdate");

//Join lobby
/* 'request', {Method: 'JoinLobby', {clientId: 'player', game: 'lobbyId' } } */
const joinLobbyButton = document.getElementById("joinLobbyButton");
joinLobbyButton.addEventListener("click", () => {
  socket.emit("joinLobby", lobbyId, client);
});
socket.on("joinedLobby", joinCheck);
function joinCheck(bool) {
  if (bool) {
    console.log("joinedLobby");
  } else {
    console.log("joinLobby failed");
  }
}

//Ready Check
const readyButton = document.getElementById("readyButton");
readyButton.addEventListener("click", () => {
  client.readyCheck = true;
  socket.emit("readyCheck", client);
});
socket.on("readyCheck", (bool) => {
  if (bool) {
    //change to game view
  } else {
    console.log("readyCheck failed");
  }
});

//*********Game mode ScribbleMeThis*********//

//in Canvas.js
//prior runs canvas into guesser (nn.classify / guess)
//send AI pred (result) to server

//*********Game mode Scribblio*********//

//**Drawer emits drawing data to server for other clients and AI player
//use fullimage function to get image data from canvas
