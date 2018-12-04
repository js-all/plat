const canvas: HTMLCanvasElement = document.createElement('canvas');
const cw: number = 1000;
const ch: number = 1000;
const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
const draw_rate: number = 30;
const move_rate: number = 30;

document.body.appendChild(canvas);
canvas.width = cw;
canvas.height = ch;

ctx.imageSmoothingEnabled = false;


const player = new GameElemement(100, 100, 0, 100, 1, {
    type: 'path',
    color: new rgb(255, 0, 0),
    showPoints: true,
    closePath: false,
    points: [
        [0, 0],
        [100, 0],
        [0, 100],
        [100, 100]
    ]
}, 10, 0);
function draw(): void {
    ctx.clearRect(0, 0, cw, ch);
    player.draw(ctx);
}
function move(): void {
    player.move();
}
const move_interval: number = setInterval(move, 1000 / move_rate);
const draw_interval: number = setInterval(draw, 1000 / draw_rate);