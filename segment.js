
class Segment {
    /**
     * 
     * @param {Point} p1 
     * @param {Point} p2 
     */
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
    getVector() {
        return this.p2.pos.sub(this.p1.pos);
    }

    /**
     * 
     * @param {Segment} prevSegment 
     * @returns 
     */
    applyAngleConstraint(prevSegment) {
        const prevSegmentVector = prevSegment.getVector();
        const currentVector = this.getVector();

        // cos0 = A.x * B.x + A.y * B.y / |A| * |B|

        const dotProduct = prevSegmentVector.dot(currentVector);
        const prevMag = prevSegmentVector.mag();
        const currentMag = currentVector.mag();
        if (prevMag === 0 || currentMag === 0) return;

        const cosAngle = dotProduct / (prevMag * currentMag);
        console.log(cosAngle);
        const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
        const maxAngle = Math.PI / 7
        if (angle > maxAngle) {

            const prevDirection = prevSegmentVector.normalize();
            const currentDirection = currentVector.normalize();

            const sign = Math.sign(prevDirection.cross(currentDirection));
            //x: this.x * cos - this.y * sin
            //y: this.x * sin + this.y * cos
            const targetDirection = prevDirection.rotate(maxAngle * sign)

            const targetVector = targetDirection.scale(currentMag);
            const correction = targetVector.sub(currentVector).scale(0.2);
            this.p2.pos = this.p2.pos.add(correction);

        }
    }

    update() {
        const currentVector = this.p1.pos.sub(this.p2.pos);
        const currentLength = currentVector.mag()
        if (Math.abs(currentLength) !== Math.abs(this.maxLength)) {
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