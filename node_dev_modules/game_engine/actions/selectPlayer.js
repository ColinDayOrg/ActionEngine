function setPlayer(instance, index) {
  instance.setCurrentPlayer(
    instance.getPlayers()[index]);
}

function selectPlayer(instance, action, data) {
  if (action.type === 'random') {
    var players = instance.getPlayers();
    var index = Math.floor((Math.random()*players.length));
    return setPlayer(instance, index);
  }

  if (action.type === 'first')
    return setPlayer(instance, 0);

  if (action.type === 'second')
    return setPlayer(instance, 1);
}

module.exports = selectPlayer;
