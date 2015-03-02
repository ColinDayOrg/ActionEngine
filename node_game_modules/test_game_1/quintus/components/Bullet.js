Q.Piece.extend('Bullet', {
  init: function(p) {
    p.wait = true;
    p.t = 0.00;
    this._super(p, {});
  },

  step: function(dt) {
    this.p.t += dt;
  },

  draw: function(ctx) {
    if (this.p.t) {
      if (!this.p.start) {
        var item = Stage.get(this.parent).p;
        this.p.start = { x: item.x, y: item.y };
      }

      if (!this.p.end) {
        var target = Stage.get(this.p.data.target).p;
        this.p.end = { x: target.x*2, y: target.y*2 };
        this.p.end.x -= this.p.start.x;
        this.p.end.y -= this.p.start.y;
      }

      if (!this.p.length) {
        var dx = this.p.end.x - this.p.start.x;
        var dy = this.p.end.y - this.p.start.y;
        this.p.length = Math.sqrt(dx*dx + dy*dy);
      } 

      var dt = (this.p.t/this.p.length)*Structure.Bullet.velocity;
      if (dt <= 1) 
      {
        ctx.fillStyle = Color.RGB(Structure.Arrow.fillColor);
        ctx.strokeStyle = Color.RGB(Structure.Arrow.edgeColor);
        ctx.lineWidth = this.p.size*Structure.Arrow.lineWidth;

        Canvas.Draw.circle(
          Geometry.calcParamPoint(this.p.start, this.p.end, dt), 
          Structure.Bullet.size)(ctx);
        ctx.fill();
        ctx.stroke();

        return;
      }

      delete this.p.t;
    }

    if (!this.p.done) {
      this.p.done = true;
      State.nextAction();
    }
  }
});
