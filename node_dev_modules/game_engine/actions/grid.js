var placePiece = require('./placePiece');

function grid(instance, action, data) {
  var gridAction = {
    "action": "placePiece",
    "type": action.type,
    "layout": action.layout
  };

  var names = [];
  for (var yIndex = 0;yIndex < action.y;++yIndex) {
    for (var xIndex = 0;xIndex < action.x;++xIndex) {
      gridAction.coords = { x: xIndex, y: yIndex };
      names.push(placePiece(instance, gridAction, data));
    }
  }

  if (action.topology) {
    var topoData = {
      x: action.x,
      y: action.y,
      items: names
    };
    require('../topology/' + action.topology)(instance, topoData);
  }
}

module.exports = grid;
