function getLayoutData(action) {
  return {
    layout: action.layout,
    coords: action.coords
  }
}

function getPieceData(instance, action, data) {
  if (action.layout !== undefined)
    return getLayoutData(action);

  var parent = action.parent;
  if (!parent)
    parent = data.id;

  var command = {
    parent: parent,
    name: action.name
  }

  var data;
  if (action.player === 'current') {
    data = data || {};
    data.player = instance.getCurrentPlayer().index;
  }
  if (action.target) {
    data = data || {};
    data.target = action.target;
  }

  if (data)
    command.data = data;

  return command;
}

function placePiece(instance, action, data) {
  if (action.type !== undefined) 
    return { 
      data: instance.addToStage(
        action.type,
        getPieceData(instance, action, data)) 
    }
}

module.exports = placePiece;
