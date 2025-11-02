
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
        this.speed = new Vector(0, 0);
        this.acceleration = 5;
        this.maxSpeed = 6;
        this.friction = 0.95
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

    /**
     * 
     * @param {Control} controls 
     */
    update(controls = null) {
        if (!controls) return;
        const keys = controls.keys;

        if (keys.ArrowRight) {
            this.speed.x += this.acceleration;
        }
        if (keys.ArrowLeft) {
            this.speed.x -= this.acceleration;
        }
        if (keys.ArrowUp) {
            this.speed.y -= this.acceleration;
        }
        if (keys.ArrowDown) {
            this.speed.y += this.acceleration;
        }

        if (this.speed.mag() > this.maxSpeed) {
            this.speed = this.speed.normalize().scale(this.maxSpeed);
        }


        this.pos = this.pos.add(this.speed);

        this.speed = this.speed.scale(this.friction)

        // if (!mouse) return;
        // const diff = this.pos.sub(mouse.pos);
        // const direction = diff.normalize().scale(diff.mag() * 0.05);
        // this.pos = this.pos.sub(direction);



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