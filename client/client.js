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

//*********Game mode Scribblio*********//

//**Drawer emits drawing data to server for other clients and AI player