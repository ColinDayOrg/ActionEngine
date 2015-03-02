var instance = require('./instance');

var gameEngineLoc = __dirname + '/../game_engine/';
var game = require(gameEngineLoc + 'game');
var engineLog = require(gameEngineLoc + 'log');

var server = {
  addGameType: function(game) {
    server.game = game;
  }
}

function addConnection(instance, socket, request, response) {
  socket.on(request, function(msg) {
    engineLog.clientRequest(request);
    socket.emit(
      response, 
      JSON.stringify(
        instance.getResponse(request, msg)));
    engineLog.serverResponse(response);
  });
}

function connect(io) {
  io.on('connection', function(socket) {
    addConnection(server.instance, socket, 'nextAction', 'setState');
  });
}

function newGame() {
  server.instance = instance.create(game.init(server.game));

  return server.game;
}

exports.addGameType = server.addGameType;
exports.connect = connect;
exports.newGame = newGame;
