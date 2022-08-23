const io = require('socket.io')();

io.on('connection', (client) => {
  client.emit('init', 'test');
});

io.listen(8081);

//Game lobby

//Game mode Pictionary

//Game mode Scribblio
