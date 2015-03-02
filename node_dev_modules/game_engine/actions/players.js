function players(instance, action, data) {
  for (var index = 0;index < action.number;++index)
    instance.addPlayer();
}

module.exports = players;
