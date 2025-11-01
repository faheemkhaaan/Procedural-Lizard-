

class Snake {
    constructor() {
        this.body = new Body();
        this.body.init();
        this.head = this.body.head;
        this.tail = this.body.tail;

    }

    update(mouse) {
        this.head.update(mouse);
        this.body.update(mouse);
    }

    draw(ctx) {
        this.body.draw(ctx);
    }
}