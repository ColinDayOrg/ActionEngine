var Canvas = {
  pathFromPoints: function(points, offset) {
    // TODO: Figure out why not???
    // ctx.beginPath();
    var nodes = [ 
      this.Draw.start(Geometry.offsetPoint(
        { x: points[0][0], y: points[0][1] },
        offset
      ))
    ]

    for (var index = 1;index < points.length;++index) {
      nodes.push(
        this.Draw.line(Geometry.offsetPoint(
          { x: points[index][0], y: points[index][1] },
          offset
      )));
    }

    nodes.push(this.Draw.end());

    return nodes;
  },

  createClosedPath: function(ctx, nodes) {
    // TODO: Figure out why???
    ctx.beginPath();
    nodes.forEach(function(node) {
      node(ctx);
    });
  },

  Draw: {
    start: function(pt) {
      return function(ctx) {
        ctx.moveTo(pt.x, pt.y);
      }
    },

    end: function() {
      return function(ctx) {
        ctx.closePath();
      }
    },

    line: function(pt) {
      return function(ctx) {
        ctx.lineTo(pt.x, pt.y);
      }
    },

    circle: function(pt, rad) {
      return function(ctx) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad, 0, 2*Math.PI, false);
      }
    },

    fillet: function(line0, line1) {
      var A = line0[0];
      var Ao = line0[1];
      var C = line1[1];
      var Co = line1[0];

      var item = Draw.line(Co);
      var B = Geometry.getLineIntersection([A, Ao], [Co, C]);
      if (B) {
        var angle = Math.PI - Geometry.getAngle(A, B, C);
        var off = Geometry.getDistance(Ao, B);
        var rad = Geometry.cot2(angle)*off;
        item = Draw.arc(B, Co, rad);
      }

      return function(ctx) {
        item(ctx);
      }
    }
  }
}
