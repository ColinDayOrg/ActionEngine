var callstack = require('./callstack');
var engineLog = require('./log');

function create(actions) {
  return (function() {
    var stack = callstack.create(actions);
    var pendingAction = null;

    function addControl(name, control) {
      control.init(stack);
      stack.addControl(name, control);
      pendingAction = null;
    }

    function getAction() {
      if (actionPending()) {
        stack.push(stack.getAction().do);
        pendingAction = null;
      }

      return stack.getAction();
    }

    function isDone() {
      return !stack.isPtrValid();
    }

    function setPendingAction(action, type, data) {
      engineLog.pendingAction(action);
      pendingAction = {
        action: action,
        type: type,
        data: data
      }
    }

    function getPendingAction() {
      return pendingAction;
    }

    function actionPending() {
      return pendingAction !== null;
    }

    var loadedActions = {}

    function nextAction(instance, data) {
      while (!isDone()) {
        var action = getAction();
        if (!loadedActions[action.action])
          loadedActions[action.action] = require('./actions/' + action.action);
        var result = loadedActions[action.action](instance, action, data);
        if (!result || !result.control) {
          if (actionPending()) {
            break;
          }

          stack.incPtr();
        }
      }
    }

    return {
      nextAction: nextAction,
      addControl: addControl,
      setPendingAction: setPendingAction,
      getPendingAction: getPendingAction,
    }
  }());
}

exports.create = create;
