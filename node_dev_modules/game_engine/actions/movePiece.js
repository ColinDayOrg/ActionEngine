var control = require(__dirname + '/../control');
var impl = control.getStepImpl();

// TODO: Figure out where these should come from
var piece = 'piece';
var to = 'to';

function distance(command, instance, action, from) {
  if (action.distance) {
    command.distance = action.distance;
    command.from = instance.getSelection(from);
  }
}

function startSelectPiece(instance, action, startActions) {
  return control.addImpl(impl, startActions);
}

function startSelectTo(instance, stack) {
  action = stack.getAction();

  var moveActions = [control.select(action[to], to)];
  distance(moveActions[0], instance, action[to], piece);

  var connector;
  if (action.connector) {
    connector = control.createConnector(instance, action.connector);
    moveActions.unshift(connector);
  }

  control.addImpl(impl, moveActions, connector);
}

function completeSelectTo(instance, stack) {
  instance.moveOnStage({
    piece: instance.getSelection(piece),
    to: instance.getSelection(to)
  });

  var moveActions = control.completeConnector(instance, stack);

  var after = stack.getAction().after;
  if (after)
    moveActions = moveActions.concat(after);

  moveActions.push(control.deselect(piece));
  moveActions.push(control.deselect(to));

  stack.push(moveActions);
}

function movePiece(instance, action, data) {
  impl.addStep(piece, startSelectPiece, control.completeConnector);
  impl.addStep(to, startSelectTo, completeSelectTo);

  return impl.init(instance, action);
}

module.exports = movePiece;
