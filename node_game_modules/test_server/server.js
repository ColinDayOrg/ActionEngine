var gameServerLoc = __dirname + '/../../node_dev_modules/game_server/';
var gameServer = require(gameServerLoc + 'server');

gameServer.addGameType({
  "name": "test_game_1",
  "type": "quintus"
});

exports.connect = gameServer.connect;
exports.newGame = gameServer.newGame;
