/**
 * @type {HTMLCanvasElement}
 */
const canvas = myCanvas;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const p1 = new Point()
const p2 = new Point()

const seg = new Segment(p1, p2);

p1.setPos(100, 200);
p1.setRad(10);

p2.setPos(200, 200)
p2.setRad(10)
animate()
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    p1.draw(ctx);
    p2.draw(ctx);
    seg.draw(ctx);
    requestAnimationFrame(animate)
}