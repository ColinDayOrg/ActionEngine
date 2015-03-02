var Path = {
  distance: {
    max: 0,
    init: function(max) {
      this.max = max;
      return this;
    },
    calculate: function(cost, from, to) {
      if (!cost)
        cost = 0;
      return cost + 1;
    },
    test: function(cost, to) {
      return (cost <= this.max);
    }
  },

  itemsCollector: {
    data: [],
    init: function() {
      this.data = [];
      return this;
    },
    test: function(cost, to) {
      if (this.data.indexOf(to) !== -1)
        return false;

      this.data.push(to);
      return true;
    }
  },

  canBeHit: {
    action: {},
    init: function(action) {
      this.action = action;
      return this;
    },
    test: function(item) {
      return Selection.checkCanBeHit(this.action, item);
    }
  },

  isSelectable: {
    init: function() {
      return this;
    },
    test: function(item) {
      return item.getSelectable();
    }
  },

  breadthFirstSearchImpl: function(space, collector, toll, items) {
    var next = [];
    items.forEach(function(subItems) {
      subItems.items.forEach(function(item) {
        var from = subItems.from;
        var to = item.to;
        var cost = toll.calculate(subItems.cost, from, to);
        // Note: These tests may have side effects, keep the order
        if (space.test(to) && toll.test(cost, to) && collector.test(cost, to) && to.connections)
          next.push({cost: cost, from: to, items: to.connections});
      });
    });

    if (next.length !== 0)
      this.breadthFirstSearchImpl(space, collector, toll, next);
  },

  breadthFirstSearch: function(space, collector, toll, from) {
    if (from.connections)
      this.breadthFirstSearchImpl(space, collector, toll, [{from: from, items: from.connections}]);
    
    // Note: This parent test is separate from the rest so the others 
    //       do not get blocked if the root is not valid
    collector.test(0, from);
    
    return collector.data;
  },

  filterItems: function(action) {
    var criteria = action.data.criteria;
    if (criteria.from) {
      var space = this.canBeHit.init(action);
      var collector = this.itemsCollector.init();

      // TODO: Is there a case where it should not be the parent?
      var parent = Stage.get(Stage.get(criteria.from).parent);

      if (criteria.distance) {
        var toll = this.distance.init(criteria.distance);
        return this.breadthFirstSearch(space, collector, toll, parent);
      }
    }
  },

  getPaths: function(from, to) {
    // TODO: Is there a case where it should not be the parent?
    var parent = Stage.get(from.parent);
    if (parent === to)
      return [[to]];

    var space = this.isSelectable.init();
    var collector = this.pathsCollector.init(to);
    var toll = this.pathsCollector.getToll();
    return this.breadthFirstSearch(space, collector, toll, parent);
  },

  pathsCollector: {
    to: {},
    data: [],
    init: function(to) {
      this.to = to;
      this.data = [];
      return this;
    },
    test: function(cost, to) {
      if (this.data.length === 0) {
        if (to === this.to) {
          this.data.push(cost);
          this.minLength.setMaxLength(cost.length);
          return false;
        }

        return true;
      }

      if (to === this.to) {
        if (this.data[0].length > cost.length)
          this.data = [];

        this.data.push(cost);
        this.minLength.setMaxLength(cost.length);
        return false;
      }

      return true;
    },

    minLength: {
      init: function() {
        delete this.maxLength;
        return this;
      },
      setMaxLength: function(length) {
        this.maxLength = length;
      },
      calculate: function(cost, from, to) {
        if (!cost)
          cost = [from];
        return cost.concat([to]);
      },
      test: function(cost, to) {
        return (!this.maxLength || cost.length <= this.maxLength);
      }
    },
    getToll: function() {
      return this.minLength.init();
    }
  }
}
