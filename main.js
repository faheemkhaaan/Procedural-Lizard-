/**
 * @type {HTMLCanvasElement}
 */
const canvas = myCanvas;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const snake = new Snake();
const mouse = new Point();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

window.addEventListener("mousemove", (e) => {
    mouse.setPos(e.x, e.y);
});


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    snake.draw(ctx);
    snake.update(mouse);
    requestAnimationFrame(animate);
};
animate();