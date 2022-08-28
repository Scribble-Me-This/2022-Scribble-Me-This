const socket = io('http://localhost:8081');

//*********Game lobby*********//

//Create lobby
/* 'request', {Method: 'CreateLobby', clientId: 'leader' } 
whoever creates the lobby is the leader, and the leader also joins the lobby
*/

//Update lobby Request
/* 'request', {Method: 'UpdateLobby', {clientId: 'test' , game: lobbyid and setting} } */

//Join lobby
/* 'request', {Method: 'JoinLobby', {clientId: 'player', game: 'lobbyId' } } */

//Ready Check

//*********Game mode ScribbleMeThis*********//

//in Canvas.js
//prior runs canvas into guesser (nn.classify / guess)
//send AI pred (result) to server

//*********Game mode Scribblio*********//

//**Drawer emits drawing data to server for other clients and AI player
//use fullimage function to get image data from canvas