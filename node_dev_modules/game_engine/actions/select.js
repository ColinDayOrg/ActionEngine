function select(instance, action, data) {
  var data = {};
  if (action.condition)
    data.condition = action.condition;

  if (action.from) {
    if (action.distance) {
      data.criteria = {
        from: action.from,
        distance: action.distance
      }
    }
  }

  instance.setPendingAction(action, data);
}

module.exports = select;
