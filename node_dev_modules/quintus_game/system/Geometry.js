var Geometry = {
  calcParamPoint: function(start, end, t) {
    var dx = (end.x - start.x);
    var dy = (end.y - start.y);
    var lt = t === 1 ? t : t%1;
    return {
      x: start.x + dx*lt,
      y: start.y + dy*lt
    }
  },

  offsetPoint: function(point, offset) {
    offset = offset || { x:0, y:0 }
    return { x: point.x + offset.x, y: point.y + offset.y }
  },

  // calcPt: function(origin, angle, length) {
  //   return {
  //     x: Math.floor(origin.x + Math.cos(angle)*length),
  //     y: Math.floor(origin.y + Math.sin(angle)*length)
  //   }
  // },

  // calcOffsetPt: function(line, off, fromEnd) {
  //   var dx = line[1].x - line[0].x;
  //   var dy = line[1].y - line[0].y;
  //   var len = Math.sqrt(dx*dx + dy*dy);
  //   var ratio = off/len;
  //   dx *= ratio;
  //   dy *= ratio;
  //   if (fromEnd) {
  //     return {
  //       x: line[1].x - dx,
  //       y: line[1].y - dy
  //     }
  //   } else {
  //     return {
  //       x: line[0].x + dx,
  //       y: line[0].y + dy
  //     }
  //   }
  // },

  getLineIntersection: function(line0, line1) {
    var d0x = line0[1].x - line0[0].x;
    var d0y = line0[1].y - line0[0].y;
    var d1x = line1[1].x - line1[0].x;
    var d1y = line1[1].y - line1[0].y;

    var den = d1y*d0x - d1x*d0y;
    if (den === 0)
      return;

    var dSx = line0[0].x - line1[0].x;
    var dSy = line0[0].y - line1[0].y;
    var num = d1x*dSy - d1y*dSx;
    var ratio = num/den;

    return {
      x: line0[0].x + ratio*d0x,
      y: line0[0].y + ratio*d0y
    }
  },

  getDistance: function(A, B) {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));    
  },

  getAngle: function(A, B, C) {
      var AB = getDistance(A, B);
      var BC = getDistance(B, C);
      var AC = getDistance(A, C);
      return Math.acos((BC*BC + AB*AB - AC*AC)/(2*BC*AB));
  },

  cot2: function(rad) {
    return 1/Math.tan(rad/2);
  }
}
