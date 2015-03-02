Spatial.HexLayout = {
  getLocation: function(parent, size, data) {
    var xBase = parent.xBase;
    var yBase = parent.yBase;
    var dx = size*0.86;
    var dy = size*0.72;
    var x = data.x;
    var y = data.y;
    return { 
        x: xBase + x*dx + (y%2)*dx/2, 
        y: yBase + y*dy 
    }
  }
}
