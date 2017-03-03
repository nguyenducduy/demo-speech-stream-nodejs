var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('message', function(data) {
    console.log(data);
  });
});

server.listen(9000);
