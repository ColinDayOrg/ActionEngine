var Spatial = {
  getTransformData: function(start, end) {
    var dy = (end.y - start.y) - start.y;
    var dx = (end.x - start.x) - start.x;
    var length = Math.sqrt(dx*dx + dy*dy);
    var angle = Math.atan(dy/dx); 
    if (dx < 0)
      angle += Math.PI;

    return { x: start.x, y: start.y, angle: angle, length: length }
  },
  transform: function(points, data) {
    var mat = Q.matrix2d();
    mat.translate(data.x, data.y);
    mat.rotate(data.angle);
    points.forEach(function(pt) {
      mat.transformArr(pt, pt);
    });
    mat.release();
  }
}
