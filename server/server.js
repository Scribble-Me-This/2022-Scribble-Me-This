const io = require('socket.io')(8081, {
    cors: {
      origin: ["http://localhost:8080"]
    }
});

io.on('connection', (client) => {
  console.log('Client connected', client);
  client.emit('init', 'test');
});


//*********Game lobby*********//

//Create lobby

//Update lobby

//Join lobby

//*********Game mode ScribbleMeThis*********//

//*********Game mode Scribblio*********//