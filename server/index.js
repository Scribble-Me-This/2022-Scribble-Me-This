const { db } = require('./db')
const PORT = process.env.PORT || 8080
const httpServer = require('./app')
const seed = require('../script/seed');

const init = async () => {
  try {
    // if(process.env.SEED === 'true'){
    //   await seed();
    // }
    // else {
    //   await db.sync()
    // }
    // start listening (and create a 'server' object representing our server)
    httpServer.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
  } catch (ex) {
    console.log(ex)
  }
}

init()


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

//*********Game mode Scribblio*********//

//**Server emits drawing data from drawer to other clients and AI player
//**Server runs AI player