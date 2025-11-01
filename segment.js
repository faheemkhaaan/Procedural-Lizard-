
class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.maxLength = this.p2.pos.sub(this.p1.pos).mag();
    }

    update() {
        const currentVector = this.p1.pos.sub(this.p2.pos);
        const currentLength = currentVector.mag()
        if (currentLength > this.maxLength) {
            const direction = currentVector.normalize();
            const exessiveLength = currentLength - this.maxLength;

            this.p2.pos = this.p2.pos.add(direction.scale(exessiveLength));
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.stroke();
    }
}