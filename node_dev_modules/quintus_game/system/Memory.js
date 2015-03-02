var Memory = {
  map: [],
  add: function(data) {
    this.map[data.tag] = data.data;
  },

  remove: function(data) {
    delete this.map[data.tag];
  },

  setCurrentPlayer: function(data) {
    // Note: currentPlayer (i.e. data) can equal zero, must check against undefined
    if (data !== undefined)
      Memory.currentPlayer = data.data;
  }
}
