Q.Piece.extend('Arrow', {
  init: function(p) {
    this._super(p, {});
    this.geometry = PointCache(getArrowPoints);
  },

  draw: function(ctx) {
    if (!State.over)
      return;

    var item = Stage.get(this.parent).p;

    var start = { x: item.x, y: item.y };
    var end = { x: State.over.p.x*2, y: State.over.p.y*2 };
    var data = Spatial.getTransformData(start, end);
    
    var pts = this.geometry.getPoints({ 
      length: data.length,
      width: Structure.Arrow.width,
      startOffset: Structure.Arrow.startOffset,
      arrowHeadOffset: Structure.Arrow.arrowHeadOffset,
      arrowHeadWidth: Structure.Arrow.arrowHeadWidth
    }, true);

    Spatial.transform(pts, data);
    var path = Canvas.pathFromPoints(pts);
    Canvas.createClosedPath(ctx, path);

    ctx.fillStyle = Color.RGB(Structure.Arrow.fillColor);
    ctx.fill();

    ctx.strokeStyle = Color.RGB(Structure.Arrow.edgeColor);
    ctx.lineWidth = this.p.size*Structure.Arrow.lineWidth;
    ctx.stroke();
  }
});
