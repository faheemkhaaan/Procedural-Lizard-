

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    add(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    scale(factor) {
        return new Vector(this.x * factor, this.y * factor)
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    mag() {
        return Math.hypot(this.x, this.y);
    }


    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        )
    }
    normalize() {
        const mag = this.mag();
        if (mag > 0) {
            return new Vector(this.x / mag, this.y / mag);
        }
        return new Vector(0, 0);
    }
    normal() {
        return new Vector(-this.y, this.x);
    }

}