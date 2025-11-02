

class Skin {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
        this.skinPoints = []
        this.init()
    }
    init() {
        const rightPoints = [];
        const leftPoints = [];
        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            const leftP = seg.leftPoints();
            const rightP = seg.rightPoints();
            rightPoints.unshift(...rightP);
            leftPoints.push(...leftP);
        }
        this.skinPoints.push(...leftPoints, ...rightPoints);
    }
    update() {
        this.skinPoints.length = 0;
        this.init()

        this.skinPoints.forEach(p => p.update());
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.skinPoints[0].pos.x, this.skinPoints[0].pos.y);
        for (let i = 1; i < this.skinPoints.length; i++) {
            const point = this.skinPoints[i];
            ctx.lineTo(point.pos.x, point.pos.y);
        }
        ctx.fill()
        ctx.stroke()
    }
}

/*
   .  .  .  .  .  
.__.__.__.__.__.__.
0--0--0--0--0--0--0
.__.__.__.__.__.__.
   .  .  .  .  .  
*/