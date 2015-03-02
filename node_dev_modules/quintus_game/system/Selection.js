var Selection = {
  selectable: {
    selectable: [],
    reset: function() {
      if (this.selectable) {
        this.selectable.forEach(function(item) {
          item.resetSelectable();
        });
        this.selectable = [];
      }
    },

    push: function(item) {
      this.selectable.push(item);
      item.setSelectable();
    }
  },

  // Pre-Selection
  checkCanBeHit: function(action, item) {
    if (action.type !== item.__proto__.className)
      return false;

    if (action.data.condition === 'empty')
      if (item.contents && item.contents.length > 0) {
        if (!action.data.criteria)
          return false;
        
        // Check for zero move
        var parent = Stage.get(Stage.get(action.data.criteria.from).parent);
        if (parent !== item)
          return false;
      }

    if (action.data.condition === 'currentPlayer')
      if (Memory.currentPlayer !== item.p.data.player)
        return false;

    if (action.data.condition === 'otherPlayer')
      if (Memory.currentPlayer === item.p.data.player)
        return false;

    return true;
  },

  initialize: function(action) {
console.log(action);    
    this.selectable.reset();
    if (!action)
      return;

    if (action.data.criteria) {
      var items = Path.filterItems(action);
      if (items)
        items.forEach(function(item) {
          if (Selection.checkCanBeHit(action, item))
            Selection.selectable.push(item);
        });

      return;
    } 

    var items = Q(action.type).items;
    if (items)
      items.forEach(function(item) {
        if (Selection.checkCanBeHit(action, item))
          Selection.selectable.push(item);
      });
  },

  currentPath: 0,
  
  // Post-Selection
  add: function(data) {
    Stage.get(data.data).selected = true;
  },

  remove: function(data) {
    delete Stage.get(data.data).selected;
  }
}

Q.component('selectable', {
  extend: {
    setSelectable: function() {
      this.p.selectable = true;
    },
    resetSelectable: function() {
      delete this.p.selectable;
    },

    getSelectable: function() {
      return this.p.selectable;
    }
  }
});

// Q.component('selectable_child', {
//   extend: {
//     setSelectable: function() {
//       Stage.get(this.parent).setSelectable();
//     },

//     resetSelectable: function() {
//       Stage.get(this.parent).resetSelectable();
//     },

//     getSelectable: function() {
//       return Stage.get(this.parent).getSelectable();
//     }
//   }
// });

Q.component('select_state', {
  added: function() {
    this.entity.p.state = '';
    this.entity.p.pick = Pick;
  },
  extend: {
    init: function(createFunc) {
      this.p.pick.init(createFunc);
    },
    stepSelectable: function() {
      this.p.state = '';
      if (State.checkHit(this)) {
        this.p.state = 'hover';
        State.checkHit(this);
      }
    },
    hitTest: function() {
      var location = {
        x: Mouse.location.x - this.p.x,
        y: Mouse.location.y - this.p.y
      }
      var size = this.p.size*0.95;

      return this.p.pick.hitTest(location, size);
    },
    isHovering: function() {
      return (this.p.state === 'hover');
    },
    isSelected: function() {
      return this.selected;
    }
  }
});
