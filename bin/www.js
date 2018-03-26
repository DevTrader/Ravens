const chatRoom = require('../models/chatroom');

let int;

let timeOut = {};


/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('passport-local-express4:server');
var http = require('http');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);




var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection',function(socket){
  console.log('hi2 from bin/www');
  socket.on('position', function(msg){
    console.log(msg);
   io.emit('draw', msg);
  });

  

  socket.on('start', function(msg){ 


  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);


//Delete Chatroom on timer end
let time = 900000;
    clearInterval(timeOut[msg.url]);
    timeOut[msg.url] = setInterval(()=>{
          time -= 100;

          io.emit('time', time, msg);
          if(time < 1){
            time = 0;
            deleteChat(msg.url);
            io.emit('deleted', msg);
            clearInterval(timeOut[msg.url]);
          };
        
      }, 100);

  });

   socket.on('typing', function(msg){
    io.emit('typing', msg);
  });
}); 


 server.listen(port, function(){
   console.log('listening on *:' + port);
});


/**
 * Create HTTP server.
 */


/**
 * Listen on provided port, on all network interfaces.
 */

//server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function deleteChat(id){
    chatRoom
    .remove({_id: id})
    .catch(err =>{throw err});
    console.log('Room ' + id + ' deleted');

};


