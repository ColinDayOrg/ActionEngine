function nextPlayer(instance, action, data) {
  var players = instance.getPlayers();
  var currentPlayer = instance.getCurrentPlayer();
  var index = currentPlayer.index;
  ++index;
  if (index > players.length - 1)
    index = 0;

  instance.setCurrentPlayer(players[index]);
}

module.exports = nextPlayer;
