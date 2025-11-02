
class Point {
    /**
     * 
     * @param {Vector} pos 
     * @param {number} rad 
     * @param {string} color 
     */
    constructor(pos = new Vector(100, 100), rad = 5, color = "black") {
        this.pos = pos;
        this.rad = rad;
        this.color = color;
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

    update(mouse) {
        if (!mouse) return;
        const diff = this.pos.sub(mouse.pos);
        const direction = diff.normalize().scale(diff.mag() * 0.05);
        this.pos = this.pos.sub(direction);
    }

    drawEyes() {

    }
    draw(ctx, { fill = false } = {}) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Math.PI * 2);
        ctx.stroke();
        if (fill) {
            ctx.fill();
        }
    }
}