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
for (let i of CollisionObjects) {
    i.y += 250;
    i.x += 250;
}
const player = new Player(0, 0, true);
const m0 = Monster.createMonsterEntity(250, 1050, 0);
let area = null;
player.move = function () {
    if (area === null)
        return;
    Player.prototype.move.call(player);
    area.camera.x = player.x - (area.camera.width / 2 - player.width / 2);
    area.camera.y = player.y - (area.camera.height / 2 - player.height / 2);
};
player.setAction(Actions.walking);
function draw() {
    if (area === null)
        return;
    ctx.clearRect(0, 0, cw, ch);
    area.draw(ctx);
}
function move() {
    if (area === null)
        return;
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
area = Area.createAreaFromJson(maparea);
area.members.push(player);
