Q.Piece.extend('Player', {
  init: function(p) {
    this._super(p, {});
    this.add('selectable, select_state');
    this.select_state.entity.init(getHexPoints);
  },

  step: function(dt) {
    this.stepSelectable();
  },

  draw: function(ctx) {
    Canvas.Draw.circle(this.p, this.p.size)(ctx);
    ctx.fillStyle = Color.getPlayerColor(this.p.data.player);
    ctx.fill();

    ctx.strokeStyle = Color.RGB(Structure.HexSpace.outlineColor);
    ctx.lineWidth = this.p.size*Structure.Arrow.lineWidth;
    ctx.stroke();

    if (this.isHovering() || this.isSelected()) {
      Canvas.Draw.circle(this.p, this.p.size*Structure.Player.selectionSize)(ctx);
      ctx.stroke();
    }
  }
});
