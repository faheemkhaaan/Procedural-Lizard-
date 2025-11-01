

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

    mag() {
        return Math.hypot(this.x, this.y);
    }
    normalize() {
        const mag = this.mag();
        if (mag > 0) {
            return new Vector(this.x / mag, this.y / mag);
        }
        return new Vector(0, 0);
    }
    normal() {
        return new Vector(this.y, -this.x);
    }

}