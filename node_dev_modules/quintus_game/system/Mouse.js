var Mouse = {
  location: { x: 0, y: 0 },

  dispatch: function(event) {
    if (event.type === 'mousemove') {
      var canvas = document.getElementById("quintus");
      var rect = canvas.getBoundingClientRect();
      Mouse.location.x = (event.pageX - rect.left)/2;
      Mouse.location.y = (event.pageY - rect.top)/2;
    } else if (event.type === 'mousedown') {
      State.onSelect();
    } else if (event.type === 'mouseout') {
      Mouse.location.x = -1;
      Mouse.location.y = -1;
    }
    event.preventDefault();
  }
}

Q._each(["mousemove", "mousedown", "mouseout"], function(event) {
  Q.el.addEventListener(event, Mouse.dispatch);
}, this);
