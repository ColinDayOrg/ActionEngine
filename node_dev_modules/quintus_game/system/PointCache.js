var PointCache = function(createFunc) {
  function Impl() {
    this.createFunc = createFunc,
    this.points = [];

    this.getPoints = function(data, clone) {
      for (var index = 0;index < this.points.length;++index)
        if (this.points[index].data === data)
          break;
      if (index === this.points.length)
        this.points.push({data: data, pt: this.createFunc(data)});

      var pts = this.points[index].pt;
      if (!clone)
        return pts;

      return this.clonePoints(pts);
    },

    this.clonePoints = function(points) {
      var clone = [];
      points.forEach(function(coords) {
        clone.push([coords[0], coords[1]]);
      });

      return clone;
    }
  }

  return new Impl();
};

function getHexPoints(rad) {
  var dy = Math.floor(Math.sin(Math.PI/6)*rad);
  var dx = Math.floor(Math.cos(Math.PI/6)*rad);

  var points = [
    [   0, -rad ],
    [  dx,  -dy ],
    [  dx,   dy ],
    [   0,  rad ],
    [ -dx,   dy ],
    [ -dx,  -dy ]
  ];

  return points;
}

function getArrowPoints(data) {
  var len = data.length;
  var w = data.width;
  var so = data.startOffset;
  var aho = data.arrowHeadOffset;
  var ahw = data.arrowHeadWidth;

  var points = [
    [so, -w],
    [len - aho, -w],
    [len - aho, -w - ahw],
    [len, 0],
    [len - aho, w + ahw],
    [len - aho, w],
    [so, w]
  ];

  return points;
}

function getArrowTailPoints(data) {
  var len = data.length;
  var w = data.width;
  var so = data.startOffset;
  var eo = data.endOffset;

  var points = [
    [so, -w],
    [len - eo, -w],
    [len - eo, w],
    [so, w]
  ];

  return points;
}

function getArrowSegmentPoints(data) {
  var len = data.length;
  var w = data.width;
  var so = data.segmentOffset;
  var points = [
    [so, -w],
    [len - so, -w],
    [len - so, w],
    [so, w]
  ];

  return points;
}
