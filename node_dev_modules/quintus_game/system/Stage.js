var Stage = {
  dataMap: {
    items: {
      PlayArea: {} 
    },

    add: function(parent, name, item) {
      this.items[name] = item;
      this.addToParent(parent, item);
    },
    get: function(name) {
      return this.items[name];
    },
    move: function(name, newParent) {
      var item = Stage.dataMap.get(name);
      var oldParent = item.parent;
      this.removeFromParent(item);
      this.addToParent(newParent, item);
    },
    remove: function(name) {
      var item = this.get(name);
      this.removeFromParent(item);
      delete this.items[name];
    },

    addToParent: function(parent, item) {
      var loc = this.get(parent);
      if (!loc.contents)
        loc.contents = [];
      loc.contents.push(item);
      item.parent = parent;
    },
    removeFromParent: function(item) {
      var contents = this.get(item.parent).contents;
      for (var index = 0;index < contents.length;++index)
        if (contents[index].p.name === item.p.name) {
          contents.splice(index, 1);
          if (!contents.length)
            delete contents;
          break;
        }        
      delete item.parent;
    }
  },

  add: function(data) {
    var parent = data.data.parent;
    if (!parent)
      parent = 'PlayArea';

    var loc = (data.data.layout) ?
      Spatial[data.data.layout].getLocation(Structure[parent], Structure[data.type].size, data.data.coords) :
      Stage.dataMap.get(parent).p;
    data.data.x = loc.x;
    data.data.y = loc.y;

    var item = new Q[data.type](data.data);
    Stage.dataMap.add(
      parent, 
      data.data.name, 
      quintusStage.insert(item));

    return item.p.wait;
  },

  move: function(data) {
    Stage.dataMap.move(data.piece, data.to);
    var item = Stage.dataMap.get(data.piece);
    var loc = Stage.dataMap.get(item.parent);
    item.p.x = loc.p.x;
    item.p.y = loc.p.y;
  },

  remove: function(data) {
    quintusStage.remove(Stage.dataMap.get(data.name));
    Stage.dataMap.remove(data.name);
  },

  get: function(name) {
    return this.dataMap.get(name);
  }
}

Q.Sprite.extend('Piece', {
  init: function(p) {
    this._super(p, {
      size: 25,
      w: 25,
      h: 25
    });
  }
});
