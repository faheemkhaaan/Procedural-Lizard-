
class Control {

    constructor() {
        this.keys = {
            ArrowRight: false,
            ArrowLeft: false,
            ArrowUp: false,
            ArrowDown: false
        }
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
    }
}