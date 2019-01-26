"use strict";
const canvas = document.createElement('canvas');
const cw = 1500;
const ch = 1500;
const ctx = canvas.getContext('2d');
const draw_rate = 30;
const move_rate = 60;
const activeKeys = [];
const moveConst = 5;
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
const m0 = new Monster(250, 1050, 0);
const area = new Area([ground, wallLeft, wallRight, plat1, plat2, m0, player], new AreaCamera(player.x - (750 - player.width / 2), player.y - (750 - player.height / 2), 1500, 1500));
player.move = function () {
    Player.prototype.move.call(player);
    area.camera.x = player.x - (area.camera.width / 2 - player.width / 2);
    area.camera.y = player.y - (area.camera.height / 2 - player.height / 2);
};
player.setAction(Actions.walking);
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    area.draw(ctx);
}
function move() {
    area.membersAnime();
    area.membersMove();
    player.fx = 0;
    let actionUsed = false;
    if (player.isJumping && player.action !== Actions.jumping)
        player.setAction(Actions.jumping);
    for (let key of activeKeys) {
        switch (key) {
            case 37:
                player.fx = -moveConst;
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
                player.fx = moveConst;
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
