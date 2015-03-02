var Color = {
  // Hex: function(color) {
  //   return '#' + ("000000" + color.toString(0x10)).substr(-6);
  // },
  RGB: function(color) {
    return 'rgb(' + color[0] + "," + color[1] + "," + color[2] + ")";
  },
  tint: function(color, tint) {
    return [
      color[0] + tint[0],
      color[1] + tint[1],
      color[2] + tint[2]
    ]
  },
  getPlayerColor: function(index) {
    return this.RGB(Structure.Player.colors[index]);
  }
}
