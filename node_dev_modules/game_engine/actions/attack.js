var control = require(__dirname + '/../control');
var impl = control.getStepImpl();

var target = 'target';

function startSelectTarget(instance, action, startActions) {
  if (action.connector) {
    var connector = control.createConnector(instance, action.connector);
    startActions.unshift(connector);
  }

  return control.addImpl(impl, startActions, connector);
}

function completeSelectTarget(instance, stack) {
  var attackActions = control.completeConnector(instance, stack);

  // var roll = Math.floor((Math.random()*10) + 1);
  // if (true) {//roll < 7) {
  // } 

  var threat = stack.getAction().threat;
  if (threat) {
    var connector = control.createConnector(instance, threat);
    attackActions.push(connector);
    attackActions.push(control.destroyConnector(connector));
  }

  attackActions.push(control.deselect(target));

  stack.push(attackActions);
}

function attack(instance, action, data) {
  impl.addStep('target', startSelectTarget, completeSelectTarget);

  return impl.init(instance, action);
}

module.exports = attack;
