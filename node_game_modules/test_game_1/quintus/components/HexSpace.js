Q.Piece.extend('HexSpace', {
  init: function(p) {
    this._super(p, {});
    this.geometry = PointCache(getHexPoints);
    this.add('selectable, select_state');
    this.select_state.entity.init(getHexPoints);
  },

  step: function(dt) {
    this.stepSelectable();
  },

  draw: function(ctx) {
    var points = this.geometry.getPoints(this.p.size*2);
    var x = this.p.x;
    var y = this.p.y;

    var path = Canvas.pathFromPoints(points, this.p);
    Canvas.createClosedPath(ctx, path);

    if (this.isHovering())
      ctx.fillStyle = Color.RGB(Structure.HexSpace.hoverColor);
    else {
      var color = Structure.HexSpace.baseColor;
      if (this.p.selectable)
        color = Color.tint(color, Structure.HexSpace.tintColor);
      ctx.fillStyle = Color.RGB(color);
    }
    ctx.fill();

    ctx.strokeStyle = Color.RGB(Structure.HexSpace.outlineColor);
    ctx.lineWidth = this.p.size*Structure.HexSpace.outlineWidth;
    ctx.stroke();

    ctx.lineWidth = this.p.size*Structure.HexSpace.borderWidth;
    ctx.strokeStyle = Color.RGB(Structure.HexSpace.borderColor);

    // Calculate the selectable edges
    var delta = [false, false, false, false, false, false];
    var valid = [false, false, false, false, false, false];

    if (this.connections)
      for (var index = 0;index < this.connections.length;++index) {
        var connection = this.connections[index];
        valid[connection.data.id] = true;
        delta[connection.data.id] = (this.p.selectable !== connection.to.p.selectable);
      }

    // Draw the selectable edges
    for (var index = 0;index < 6;++index) {
      if ((this.p.selectable && !valid[index]) || delta[index]) {
        var pt0 = points[index];
        var pt1 = points[(index + 5)%6];

        ctx.beginPath();
        ctx.moveTo(pt0[0] + x, pt0[1] + y);
        ctx.lineTo(pt1[0] + x, pt1[1] + y);
        ctx.stroke();
      }
    }
  }
});
