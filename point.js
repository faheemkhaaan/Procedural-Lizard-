
class Point {
    constructor(pos = new Vector(100, 100), rad = 5) {
        this.pos = pos;
        this.rad = rad;
    }

    setPos(x, y) {
        const pos = new Vector(x, y);
        this.pos = pos;
        return this;
    }
    setRad(rad) {
        this.rad = rad;
        return this;
    }

    update() {

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Math.PI * 2);
        ctx.fill();
    }
}