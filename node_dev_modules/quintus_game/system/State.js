Q.State = Q.Evented.extend({
  setState: function(data) {
    this.actions = data.actions.reverse();
    this.pendingAction = data.pendingAction;
    this.nextAction();
  },

  nextAction: function() {
    var components = {
      Stage: Stage,
      Topology: Topology,
      Selection: Selection,
      Memory: Memory
    }

    while (this.actions.length) {
      var action = this.actions.pop();
      if (components[action.component][action.action](action.data))
        return;
    }

    if (this.pendingAction.action !== 'select') {
      console.log('WARNING: Non-select action...');
      return;
    }

    Selection.initialize(this.pendingAction);
  },

  onPrestep: function(event) {
    delete this.over;
  },

  checkHit: function(item, name) {
    if (!item.getSelectable())
      return false;

    if (!item.hitTest())
      return false;

    this.over = item;
    return true;
  },

  onSelect: function() {
    if (this.over) {
      Socket.send.nextAction({
        id: this.over.p.name
      });
    }
  }
});

var State = new Q.State();
quintusStage.on('prestep', State, State.onPrestep);
