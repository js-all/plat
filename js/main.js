"use strict";
const canvas = document.createElement('canvas');
const cw = 1500;
const ch = 1500;
const ctx = canvas.getContext('2d');
const draw_rate = 30;
const move_rate = 30;
const activeKeys = [];
document.body.appendChild(canvas);
canvas.width = cw;
canvas.height = ch;
ctx.imageSmoothingEnabled = false;
const ground = new GameElement(1000 - 0, 100, 0, 900, 0, {
    type: "rectangle",
    color: rgb.green
}, 0, 0, true);
const wallRight = new GameElement(100, 1000 - 100, 1000 - 100, 0, 0, {
    type: "rectangle",
    color: 'red'
}, 0, 0, true);
const wallLeft = new GameElement(100, 600, 0, 0, 0, {
    type: 'rectangle',
    color: 'pink'
}, 0, 0, true);
const plat1 = new GameElement(1000 / 3, 100, 0, 600, 0, {
    type: 'rectangle',
    color: 'orange'
}, 0, 0, true);
const plat2 = new GameElement(1000 / 3, 100, 1000 / 3 * 2 / 2, 300, 0, {
    type: 'rectangle',
    color: 'blue'
}, 0, 0, true);
for (let i of CollisionObjects) {
    i.y += 250;
    i.x += 250;
}
const player = new Player(250, 1050, true);
player.setAction(Actions.walking);
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    for (let i of CollisionObjects) {
        i.draw(ctx);
    }
    player.draw(ctx);
}
function move() {
    player.anime();
    player.move();
    ground.move();
    player.fx = 0;
    let actionUsed = false;
    if (player.isJumping && player.action !== Actions.jumping)
        player.setAction(Actions.jumping);
    for (let key of activeKeys) {
        switch (key) {
            case 37:
                player.fx = -10;
                //player.orientation = Orientation.left;
                if (player.action !== Actions.walking)
                    player.setAction(Actions.walking);
                actionUsed = true;
                break;
            case 38:
                if (player.isJumping && player.action !== Actions.jumping)
                    player.setAction(Actions.jumping);
                player.jump();
                actionUsed = true;
                break;
            case 39:
                player.fx = 10;
                //player.orientation = Orientation.right;
                if (player.action !== Actions.walking)
                    player.setAction(Actions.walking);
                actionUsed = true;
                break;
            case 16:
                if (player.action !== Actions.attacking)
                    player.setAction(Actions.attacking);
                actionUsed = true;
        }
    }
    if (!actionUsed) {
        if (player.action !== Actions.nothing)
            player.setAction(Actions.nothing);
    }
}
const move_interval = setInterval(move, 1000 / move_rate);
const draw_interval = setInterval(draw, 1000 / draw_rate);
document.addEventListener('keydown', e => { if (activeKeys.indexOf(e.keyCode) === -1)
    activeKeys.push(e.keyCode); });
document.addEventListener('keyup', e => { if (activeKeys.indexOf(e.keyCode) !== -1)
    activeKeys.splice(activeKeys.indexOf(e.keyCode), 1); });
