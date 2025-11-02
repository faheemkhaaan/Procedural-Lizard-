
class Control {

    constructor() {
        this.keys = {
            ArrowRight: false,
            ArrowLeft: false,
            ArrowUp: false,
            ArrowDown: false
        };
        this.initalTouch = null;
        this.#addEventListeners();
    }

    #addEventListeners() {
        window.addEventListener("keydown", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });
        window.addEventListener("keyup", (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });

        window.addEventListener('touchstart', e => {
            const touch = e.targetTouches[0];
            this.initalTouch = new Vector(touch.clientX, touch.clientY);
        });
        window.addEventListener('touchmove', (e) => {
            if (!this.initalTouch) return;
            const currentTouch = e.targetTouches[0];
            const currentVector = new Vector(currentTouch.clientX, currentTouch.clientY);
            const deltaX = currentVector.x - this.initalTouch.x;
            const deltaY = currentVector.y - this.initalTouch.y;
            this.keys.ArrowDown = false;
            this.keys.ArrowUp = false;
            this.keys.ArrowRight = false;
            this.keys.ArrowLeft = false;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.keys.ArrowRight = true;
                } else {
                    this.keys.ArrowLeft = true;
                }
            } else {
                if (deltaY > 0) {
                    this.keys.ArrowDown = true;
                } else {
                    this.keys.ArrowUp = true;
                }
            }

        });
        window.addEventListener("touchend", (e) => {
            this.keys.ArrowDown = false;
            this.keys.ArrowUp = false;
            this.keys.ArrowRight = false;
            this.keys.ArrowLeft = false;
            this.initalTouch = null;
        })
    }
}