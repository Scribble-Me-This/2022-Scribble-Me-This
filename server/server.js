const io = require('socket.io')(8081, {
    cors: {
      origin: ["http://localhost:8080"]
    }
});

io.on('connection', (client) => {
  console.log('Client connected: server', client);
  client.emit('init', 'test');
});


//*********Game lobby*********//

//Create lobby
/* 'response', {Method: 'CreateLobby', game: {settings like game id and settings} } */

//Update lobby Reciever
/* 'response', {Method: 'UpdateLobby', game: {new settings} } 
this goes out to all connected clients*/

//Join lobby
/* 'response', {Method: 'CreateLobby', {game: {settings}, clients: [arr of players]} } */

//Broadcast Ready Check

//*********Game mode ScribbleMeThis*********//

//send package to clients (game state/ timings)

//recevies AI pred from players and updates game state

//*********Game mode Scribblio*********//

//**Server emits drawing data from drawer to other clients and AI player
//**Server runs AI player