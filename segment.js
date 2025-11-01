
class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.maxLength = this.p2.pos.sub(this.p1.pos).mag();
    }

    leftPoints() {
        const segmentVector = this.p2.pos.sub(this.p1.pos);
        const normal = segmentVector.normal();
        const normalDirection = normal.normalize();
        const pos1 = this.p1.pos.sub(normalDirection.scale(this.p1.rad));
        const pos2 = this.p2.pos.sub(normalDirection.scale(this.p2.rad));
        const p1 = new Point(pos1, 2);
        const p2 = new Point(pos2, 2);

        return [p1, p2];
    }

    rightPoints() {
        const segmentVector = this.p2.pos.sub(this.p1.pos);
        const normal = segmentVector.normal();
        const normalDirection = normal.normalize();
        const pos1 = this.p1.pos.add(normalDirection.scale(this.p1.rad));
        const pos2 = this.p2.pos.add(normalDirection.scale(this.p2.rad));
        const p1 = new Point(pos1, 2);
        const p2 = new Point(pos2, 2);
        return [p2, p1];
    }

    update() {
        const currentVector = this.p1.pos.sub(this.p2.pos);
        const currentLength = currentVector.mag()
        if (currentLength > this.maxLength) {
            const direction = currentVector.normalize();
            const exessiveLength = currentLength - this.maxLength;

            this.p2.pos = this.p2.pos.add(direction.scale(exessiveLength));
            // this.p1.pos = this.p1.pos.sub(direction.scale(exessiveLength * 0.5));
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.stroke();
    }
}