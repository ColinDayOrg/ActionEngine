var Pick = (function () {
  function createBBox(points) {
    var bx = [[], []];
    for (var index = 0;index < points.length;++index) {
      var pt = points[index];
      if (bx[0][0] === undefined || pt[0] < bx[0][0])
        bx[0][0] = pt[0];
      if (bx[0][1] === undefined || pt[1] < bx[0][1])
        bx[0][1] = pt[1];
      if (bx[1][0] === undefined || pt[0] > bx[1][0])
        bx[1][0] = pt[0];
      if (bx[1][1] === undefined || pt[1] > bx[1][1])
        bx[1][1] = pt[1];
    }

    return bx;
  }

  function testBBox(bx, loc) {
    return loc.x > bx[0][0] && loc.x < bx[1][0] && loc.y > bx[0][1] && loc.y < bx[1][1];
  }

  function testPointWithLine(p, l) {
    return ((p.x-l[0][0])*(l[1][1]-l[0][1]) - (p.y-l[0][1])*(l[1][0]-l[0][0]) > 0);
  }

  function getLine(points, idx0, idx1) {
    return [
      [points[idx0][0], points[idx0][1]], 
      [points[idx1][0], points[idx1][1]]
    ];
  }

  function testPoints(points, loc) {
    var p = [loc.x, loc.y];

    var n = points.length;
    var low = 0;
    var high = n;
    do {
      var mid = Math.floor((low + high)/2);
      var line = getLine(points, 0, mid);
      if (testPointWithLine(loc, line))
        high = mid;
      else
        low = mid;
    } while (low + 1 < high);

    if (low === 0 || high === n)
      return false;

    var line = getLine(points, high, low);
    return (testPointWithLine(loc, line));
  }

  function Impl() {
    this.points = {};
    this.bboxes = {};

    this.init = function(createFunc) {
      this.createFunc = createFunc;
    }

    this.getPoints = function(rad) {
      if (this.points['p' + rad] === undefined) {
        this.points['p' + rad] = this.createFunc(rad);
      }

      return this.points['p' + rad];
    }

    this.getBBox = function(rad) {
      if (this.bboxes['b' + rad] === undefined) {
        this.bboxes['b' + rad] = createBBox(this.getPoints(rad));
      }
      return this.bboxes['b' + rad];
    }

    this.hitTest = function(location, size) {
      return (
        testBBox(this.getBBox(size), location) && 
        testPoints(this.getPoints(size), location)
      );
    }
  }

  return new Impl();
})();
