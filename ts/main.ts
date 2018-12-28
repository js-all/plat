const canvas: HTMLCanvasElement = document.createElement('canvas');
const cw: number = 1500;
const ch: number = 1500;
const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
const draw_rate: number = 30;
const move_rate: number = 30;
const activeKeys: number[] = [];

document.body.appendChild(canvas);
canvas.width = cw;
canvas.height = ch;

ctx.imageSmoothingEnabled = false;

const ground = new GameElemement(1000 - 0, 100, 0, 900, 0, {
    type: "rectangle",
    color: rgb.green
}, 0, 0, true);
const wallRight = new GameElemement(100, 1000 - 100, 1000 - 100, 0, 0, {
    type: "rectangle",
    color: 'red'
}, 0, 0, true);
const wallLeft = new GameElemement(100, 600, 0, 0, 0, {
    type: 'rectangle',
    color: 'pink'
}, 0, 0, true);
const plat1 = new GameElemement(1000 / 3, 100, 0, 600, 0, {
    type: 'rectangle',
    color: 'orange'
}, 0, 0, true);
const plat2 = new GameElemement(1000 / 3, 100, 1000 / 3 * 2 / 2, 300, 0, {
    type: 'rectangle',
    color: 'blue'
}, 0, 0, true);
for(let i of CollisionObjects) {
    i.y += 250;
    i.x += 250;
}
const player = new Player(250, 1050, true);

player.setAction(Actions.walking);
function draw(): void {
    ctx.clearRect(0, 0, cw, ch);
    for(let i of CollisionObjects) {
        i.draw(ctx);
    }
    player.draw(ctx);
}
function move(): void {
    player.anime();
    player.move();
    ground.move()
    player.fx = 0;
    let actionUsed = false;
    for (let key of activeKeys) {
        switch (key) {
            case 37:
                player.fx = -10;
                player.orientation = Orientation.left;
                if (player.action !== Actions.walking) player.setAction(Actions.walking);
                actionUsed = true;
                break;
            case 38:
                if (!player.isJumping) player.jump();
                if (player.isJumping && player.action !== Actions.jumping) player.setAction(Actions.jumping);
                actionUsed = true;
                break;
            case 39:
                player.fx = 10;
                player.orientation = Orientation.right;
                if (player.action !== Actions.walking) player.setAction(Actions.walking);
                actionUsed = true;
                break;
        }
    }
    if (!actionUsed) {
        if (player.action !== Actions.nothing) player.setAction(Actions.nothing);
    }
}
const move_interval: number = setInterval(move, 1000 / move_rate);
const draw_interval: number = setInterval(draw, 1000 / draw_rate);

document.addEventListener('keydown', e => { if (activeKeys.indexOf(e.keyCode) === -1) activeKeys.push(e.keyCode); });

document.addEventListener('keyup', e => { if (activeKeys.indexOf(e.keyCode) !== -1) activeKeys.splice(activeKeys.indexOf(e.keyCode), 1); });