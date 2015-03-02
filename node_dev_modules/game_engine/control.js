function select(action, name) {
  return {
    action: 'select',
    type: action.type,
    condition: action.condition,
    do: [{
      action: 'saveSelection',
      name: name
    }]
  }
}

function deselect(name) {
  return {
    action: 'removeSelection',
    name: name
  }
}

function createConnector(instance, type) {
  var command = {
    action: 'placePiece',
    type: type,
    name: instance.getName(type),
    parent: instance.getSelection('piece'),
  }

  var target = instance.getSelection('target');
  if (target)
    command.target = target;

  return command;
}

function destroyConnector(connector) {
  return {
    action: 'removePiece',
    name: connector.name
  }
}

function create(instance, actions, test, itemTest, connector) {
  return {
    init: function(stack) {
      stack.push(actions);
      if (connector)
        stack.getPtr().connector = connector;
    },

    doTest: function(stack) { 
      return test(instance, stack, this); 
    },

    test: itemTest
  }
}

function add(instance, name, actions, test, itemTest, connector) {
  instance.addControl(
    name,
    create(
      instance, 
      actions,
      test,
      itemTest,
      connector));

  return { control: true };
}

function addImpl(impl, actions, connector) {
  return add(
    impl.instance, 
    impl.name, 
    actions,
    impl.getCheckStep(),
    undefined,
    connector
  );
}

function completeConnector(instance, stack) {
  var actions = [];
  var current = stack.getPtr();
  if (current.connector) {
    actions = 
      actions.concat(
        destroyConnector(current.connector));
    delete current.connector;
  }

  stack.pop();

  return actions;
}

function getStepImpl() {
  return {
    addStep: function(name, start, complete) {
      if (!this.steps)
        this.steps = {};

      var step = { 
        name: name,
        start: start, 
        complete: complete 
      };
      this.steps[name] = step;

      if (!this.first)
        this.first = step;

      if (this.last)
        this.last.next = step;
      this.last = step;
    },

    init: function(instance, action) {
      this.name = action.action;
      this.instance = instance;

      var startActions = [select(action[this.first.name], this.first.name)];
      return this.first.start(instance, action, startActions);
    },

    getCheckStep: function() {
      var impl = this;
      return function(instance, stack) {
        var action = stack.getAction().do[0];

        if (action.name) {
          var current = impl.steps[action.name];
          current.complete(instance, stack);
          if (current.next) 
            current.next.start(instance, stack);

          return true;
        } 

        return false;
      }
    }
  }
}

exports.select = select;
exports.deselect = deselect;
exports.createConnector = createConnector;
exports.destroyConnector = destroyConnector;
exports.add = add;
exports.addImpl = addImpl;
exports.completeConnector = completeConnector;

exports.getStepImpl = getStepImpl;
