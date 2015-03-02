var express = require('express');

var testServerLoc = __dirname + '/../node_game_modules/test_server/';
var testServer = require(testServerLoc + 'server');

function gameRouter(socket) {
  testServer.connect(socket);

  var router = express.Router();
  router.get('/', function(req, res) {
    var game = testServer.newGame();
    game.client.render(
      game.structure, 
      game.components, 
      function(data) {
        (function(res){
          res.send(data);
        })(res);
      }
    );
  });

  return router;
}

module.exports = gameRouter;

