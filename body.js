

class Body {
    /**
     * 
     * @param {Points[]} points 
     * @param {Segment[]} segments 
     */
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;

        this.skin = null;

    }

    init(radiuses = [5, 7, 6, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 9, 9, 8, 7, 7, 6, 6, 5, 4, 3]) {
        let x = 100, y = 100, spacing = 0;
        for (const rad of radiuses) {
            const p = new Point();
            p.setPos(x + spacing, y).setRad(rad);
            spacing += 10;
            this.points.push(p);
        }
        for (let i = 1; i < this.points.length; i++) {
            const p1 = this.points[i - 1];
            const p2 = this.points[i];
            const seg = new Segment(p1, p2);
            this.segments.push(seg);
        }
        this.skin = new Skin(this.points, this.segments);
    }

    get head() {
        return this.points[0];
    }
    get tail() {
        return this.points[this.points.length - 1];
    }
    update() {
        this.points.forEach(p => p.update());

        this.segments.forEach(s => s.update());
        for (let i = 1; i < this.segments.length; i++) {
            const prev = this.segments[i - 1];
            const curr = this.segments[i];

            curr.applyAngleConstraint(prev);
        }
        this.skin.update();
    }

    draw(ctx) {
        // this.points.forEach(p => p.draw(ctx));
        this.head.draw(ctx);
        this.tail.draw(ctx);
        this.segments.forEach(s => s.draw(ctx));
        this.skin.draw(ctx);
    }
}