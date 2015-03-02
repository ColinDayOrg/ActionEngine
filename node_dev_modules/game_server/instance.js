var engineLog = require(__dirname + '/../game_engine/log');

function create(engine) {
  return (function() {
    var instance = {

      ////////////////////////////////////////////////
      // Private items
      engine: engine,

      data: {
        server: {
          players: [],
          currentPlayer: undefined,
          items: {},
          selection: {}
        }
      },

      names: {
        counters: {},
        createName: function(name) {
          if (!this.counters[name])
            this.counters[name] = 0;
          return name + this.counters[name]++; 
        }
      },

      ////////////////////////////////////////////////
      // Client data

      clearClientData: function() {
        delete instance.data.client;
      },

      getClientData: function() {
        if (!instance.data.client)
          instance.data.client = {}
        return instance.data.client;
      },

      addClientAction: function(component, action, data) {
        var clientData = instance.getClientData();
        if (!clientData.actions)
          clientData.actions = [];

        clientData.actions.push({
          component: component,
          action: action,
          data: data
        });
      },

      ////////////////////////////////////////////////
      // Server data

      getPlayers: function() {
        return instance.data.server.players;
      },

      numPlayers: function() {
        return instance.data.server.players.length;
      },

      getCurrentPlayer: function() {
        return instance.data.server.currentPlayer;
      },

      getSelection: function(name) {
        return instance.data.server.selection[name];
      },

      getName: function(type) {
        return instance.names.createName(type);
      },

      ////////////////////////////////////////////////
      // Data modifiers

      // Geometry
      addToStage: function(type, data) {
        if (!data.name)
          data.name = this.getName(type);
        var createInfo = {
          type: type, 
          data: data
        }

        instance.addClientAction('Stage', 'add', createInfo);

        // TODO: Enable this code when server-side item caching becomes required
        // if (!instance.data.server.items[data.name])
        //   instance.data.server.items[data.name] = {};
        // instance.data.server.items[data.name].createInfo = createInfo;

        return data.name;
      },

      removeFromStage: function(name) {
        var removeInfo = { name: name };
        instance.addClientAction('Stage', 'remove', removeInfo);
      },

      moveOnStage: function(data) {
        var moveInfo = data;
        instance.addClientAction('Stage', 'move', moveInfo);
      },

      // Topology
      addConnection: function(name1, name2, data) {
        // TODO: Enable this code when server-side topology caching becomes required
        // var item1 = instance.data.server.items[name1.data];
        // if (!item1.connections)
        //   item1.connections = {};
        // item1.connections[name2.data] = data;

        var connectionInfo = {
          from: name1.data,
          to: name2.data,
          data: data
        }

        instance.addClientAction('Topology', 'add', connectionInfo);
      },

      // Game state
      addPlayer: function() {
        var players = instance.data.server.players;
        players.push({ index: players.length });
      },

      setCurrentPlayer: function(player) {
        instance.data.server.currentPlayer = player;

        var playerInfo = {
          data: player.index
        }

        instance.addClientAction('Memory', 'setCurrentPlayer', playerInfo);
      },

      addToSelection: function(name, data) {
        engineLog.addToSelection(name, data);
        instance.data.server.selection[name] = data;
        engineLog.selection(instance.data.server.selection);

        var selectionInfo = {
          data: data
        }

        instance.addClientAction('Selection', 'add', selectionInfo);

        // TODO: Move this to a separate method later
        var memoryInfo = {
          data: data,
          tag: name
        }
        instance.addClientAction('Memory', 'add', memoryInfo);
      },

      removeFromSelection: function(name) {
        engineLog.removeFromSelection(name);
        var item = instance.data.server.selection[name];
        delete instance.data.server.selection[name];
        engineLog.selection(instance.data.server.selection);

        var selectionInfo = {
          data: item
        }

        instance.addClientAction('Selection', 'remove', selectionInfo);

        // TODO: Move this to a separate method later
        var memoryInfo = {
          tag: name
        }
        instance.addClientAction('Memory', 'remove', memoryInfo);

        return item;
      },

      // Game engine
      getResponse: function(request, msg) {
        var response = instance[request](msg);
        instance.clearClientData();
        return response;
      },

      setPendingAction: function(action, data) {
        instance.engine.setPendingAction(
          action.action, 
          action.type,
          data);
        var data = instance.getClientData();
        data.pendingAction = instance.engine.getPendingAction();
      },

      nextAction: function(data) {
        instance.engine.nextAction(instance, data);
        return instance.getClientData();
      },

      addControl: function(name, control) {
        return instance.engine.addControl(name, control);
      }
    }

    ////////////////////////////////////////////////
    // Interface

    return {
      // Server data
      getPlayers: instance.getPlayers,
      numPlayers: instance.numPlayers,
      getCurrentPlayer: instance.getCurrentPlayer,
      getSelection: instance.getSelection,
      getName: instance.getName,

      // Data modifiers
      addToStage: instance.addToStage,
      moveOnStage: instance.moveOnStage,
      removeFromStage: instance.removeFromStage,
      addConnection: instance.addConnection,
      addPlayer: instance.addPlayer,
      setCurrentPlayer: instance.setCurrentPlayer,
      addToSelection: instance.addToSelection,
      removeFromSelection: instance.removeFromSelection,

      // Game engine
      getResponse: instance.getResponse,
      setPendingAction: instance.setPendingAction,
      nextAction: instance.nextAction,
      addControl: instance.addControl
    }
  }());
}

exports.create = create;
