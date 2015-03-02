Q.Piece.extend('PathArrow', {
  init: function(p) {
    this._super(p, {});
    this.arrow = PointCache(getArrowPoints);
    this.tail = PointCache(getArrowTailPoints);
    this.segment = PointCache(getArrowSegmentPoints);
    this.paths = {};
  },

  getCurrentPath: function() {
    if (!State.over)
      return;

    var paths = this.paths[State.over.p.name];
    if (!paths) {
      paths = Path.getPaths(Stage.get(this.parent), State.over);
      if (!paths)
        return;

      this.paths[State.over.p.name] = paths;
    }

    if (!paths[0])
      return;

    if (Selection.currentPath >= paths.length)
      Selection.currentPath = 0;
    var path = paths[Selection.currentPath];

    // If there is only one space in the path, no need to draw an arrow
    if (path.length === 1)
      return;

    return path;
  },

  getSegmentPoints: function(length, isSegment, isTail, single) {
    var data = { 
      length: length,
      width: Structure.Arrow.width
    }

    if (isSegment) {
      data.segmentOffset = Structure.PathArrow.segmentOffset;
      return this.segment.getPoints(data, true);
    }
    
    data.startOffset = Structure.Arrow.startOffset;
    if (isTail) {
      data.endOffset = Structure.PathArrow.segmentOffset;
      return this.tail.getPoints(data, true);
    }

    if (!single)
      data.startOffset = Structure.PathArrow.segmentOffset;

    data.arrowHeadOffset = Structure.Arrow.arrowHeadOffset;
    data.arrowHeadWidth = Structure.Arrow.arrowHeadWidth;
    return this.arrow.getPoints(data, true);
  },

  drawSegment: function(ctx, start, end, isSegment, isTail, single) {
    var data = Spatial.getTransformData(start, end);
    var pts = this.getSegmentPoints(data.length, isSegment, isTail, single);
    Spatial.transform(pts, data);
    var path = Canvas.pathFromPoints(pts);
    Canvas.createClosedPath(ctx, path);

    ctx.fillStyle = Color.RGB(Structure.Arrow.fillColor);
    ctx.fill();

    ctx.strokeStyle = Color.RGB(Structure.Arrow.edgeColor);
    ctx.lineWidth = this.p.size*Structure.Arrow.lineWidth;
    ctx.stroke();
  },

  drawSegmented: function(ctx, path) {
    var first = path[0];
    for (var index = 0;index < path.length - 1;++index) {
      var from = path[index];
      var to = path[index + 1];
      var start = { x: from.p.x, y: from.p.y };
      var end = { x: to.p.x, y: to.p.y };
      var offset = { 
        x: start.x - first.p.x, 
        y: start.y - first.p.y
      }

      start.x += offset.x;
      start.y += offset.y;
      end.x += offset.x;
      end.y += offset.y;

      var isTail = (index === 0) && path.length > 2;
      var isSegment = !isTail && index < path.length - 2;
      var single = (path.length === 2);
      this.drawSegment(ctx, start, { x: end.x*2, y: end.y*2}, isSegment, isTail, single);

      if (index > 0 && index < path.length - 1) {
        Canvas.Draw.circle(start, Structure.PathArrow.dotSize)(ctx);
        ctx.fillStyle = Color.RGB(Structure.Arrow.fillColor);
        ctx.fill();
        ctx.strokeStyle = Color.RGB(Structure.Arrow.edgeColor);
        ctx.lineWidth = this.p.size*Structure.Arrow.lineWidth;
        ctx.stroke();
      }
    }
  },

  draw: function(ctx) {
    var currentPath = this.getCurrentPath();
    if (!currentPath)
      return;

    this.drawSegmented(ctx, currentPath);
  }
});
