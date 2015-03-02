var engineLog = require('./log');

function create(actions) {
  return (function() {
    var stack = {
      data: [],

      getPtr: function() {
        return stack.data[stack.data.length - 1];
      },

      getParentPtr: function() {
        return stack.data[stack.data.length - 2];
      },

      resetPtr: function() {
        stack.getPtr().current = 0;
      },

      incPtr: function() {
        var ptr = stack.getPtr();
        ++ptr.current;

        if (stack.data.length > 1) {
          if (!stack.isPtrValid()) {
            if (!stack.pop()) {
              var control = stack.getPtr().control;
              if (control)
                for (var item in control)
                  if (control[item].doTest(stack.getInterface()))
                    return;
              }

            stack.incPtr();
          }
        }
      },

      isPtrValid: function() {
        var ptr = stack.getPtr();
        return ptr.current < ptr.actions.length;
      },

      push: function(actions) {
        // Simple string action
        if (typeof actions === 'string')
          stack.data.push({
            actions: [{
              "action": actions
            }],
            current: 0
          });
        // Action array
        else if (actions.length !== undefined)
          stack.data.push({
            actions: actions,
            current: 0
          });
        // Single standard action
        else
          stack.data.push({
            actions: [actions],
            current: 0
          });

        engineLog.stack('push', stack.data);
      },

      pop: function() {
        stack.data.pop();
        engineLog.stack('pop', stack.data);
        return stack.data.length === 1;
      },

      getAction: function(item) {
        var ptr = item || stack.getPtr();
        return ptr.actions[ptr.current];
      },

      addControl: function(name, control) {
        var ptr = stack.getPtr();
        if (!ptr.control)
          ptr.control = {};
        ptr.control[name] = control;
        engineLog.stack('addControl', stack.data);
      },

      getInterface:function() {
        return {
          getPtr: stack.getPtr,
          getParentPtr: stack.getParentPtr,
          resetPtr: stack.resetPtr,
          incPtr: stack.incPtr,
          isPtrValid: stack.isPtrValid,
          push: stack.push,
          pop: stack.pop,
          getAction: stack.getAction,
          addControl: stack.addControl
        }
      }
    }

    if (actions)
      stack.push(actions);

    return stack.getInterface();
  }());
}

exports.create = create;
