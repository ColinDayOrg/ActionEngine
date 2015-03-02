function getDelta(index, odd) {
  if (index === 2)
    return { x: 1, y: 0 };

  if (index === 5)
    return { x: -1, y: 0 };

  var delta = { x: 0, y: 0 };

  if (index === 3 || index === 4) {
    delta.y = 1;
    if (index === 4)
      delta.x = -1;
  } else if (index === 0 || index === 1) {
    delta.y = -1;
    if (index === 1)
      delta.x = 1;
  }

  if (odd) {
    if (index === 3 || index === 4)
      delta.x += 1;
  } else {
    if (index === 0 || index === 1)
      delta.x -= 1;
  }

  return delta;
}

function checkBounds(size, coords, delta) {
  if (delta.y === -1 && coords.y < 1)
      return false;
  if (delta.y === 1 && coords.y >= size.y - 1)
      return false;
  if (delta.x === -1 && coords.x < 1)
      return false;
  if (delta.x === 1 && coords.x >= size.x - 1)
      return false;

  return true;
}

function getRelativeItem(items, size, coords, index) {
  var delta = getDelta(index, coords.y%2);

  if (!checkBounds(size, coords, delta))
    return;

  var newCoords = { x: coords.x + delta.x, y: coords.y + delta.y }
  return items[newCoords.y*size.x + newCoords.x];
}

function connect(instance, data) {
  var size = { x: data.x, y: data.y }
  data.items.forEach(function(from, fromIndex) {
    var coords = { x: fromIndex%size.x, y: Math.floor(fromIndex/size.x) }
    for (var edge = 0;edge < 6;++edge) {
      var to = getRelativeItem(data.items, size, coords, edge);
      if (to)
        instance.addConnection(from, to, { id: edge });
    }
  });
}

module.exports = connect;
