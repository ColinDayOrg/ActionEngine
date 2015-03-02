var control = require(__dirname + '/../control');

function checkCount(count, control) {
  if (!control.count)
    control.count = 1;
  ++control.count;
  if (control.count > count) {
    control.count = undefined;
  }

  return control.count === undefined;
}

function checkLoopStep(instance, stack, control) {
  var data = stack.getPtr();
  var action = data.actions[data.current];

  var parent = stack.getParentPtr();
  var parentAction = stack.getAction(parent);

  if (data.after) {
    data.after = false;

    if (control.test && control.test.doTest(data))
      return false;

    return true;
  } 
  if (parentAction.after) {
    data.after = true;
    stack.push(parentAction.after);
    return true;
  }

  if (control.test && control.test.doTest(data))
    return false;

  stack.resetPtr();
  return true;
}

function getItemTest(instance, action) {
  if (action.count) {
    var count = action.count;
    if (typeof count === 'string')
      count = instance[count]();

    return {
      doTest: function(control) { 
        return checkCount(count, control);
      }
    }
  }
}

function loop(instance, action, data) {
  var loopActions = action.do;
  return control.add(
    instance, 
    'loop', 
    loopActions,
    checkLoopStep, 
    getItemTest(instance, action));
}

module.exports = loop;
