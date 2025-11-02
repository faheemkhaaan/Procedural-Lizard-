

class Snake {
    constructor() {
        this.body = new Body();
        this.body.init();
        this.head = this.body.head;
        this.tail = this.body.tail;
        this.controls = new Control();


    }

    update(mouse) {
        this.head.update(this.controls);
        this.body.update(mouse);
    }

    draw(ctx) {
        this.body.draw(ctx);
    }
}