"use strict";
var canvas = document.createElement('canvas');
var cw = 1500;
var ch = 1500;
var ctx = canvas.getContext('2d');
var draw_rate = 30;
var move_rate = 60;
var activeKeys = [];
var moveConst = 5;
document.body.appendChild(canvas);
canvas.width = cw;
canvas.height = ch;
ctx.imageSmoothingEnabled = false;
var ground = new GameElement(1000 - 0, 100, 0, 900, 0, {
    type: "rectangle",
    color: rgb.green
}, 0, 0, true);
var wallRight = new GameElement(100, 1000 - 100, 1000 - 100, 0, 0, {
    type: "rectangle",
    color: 'red'
}, 0, 0, true);
var wallLeft = new GameElement(100, 600, 0, 0, 0, {
    type: 'rectangle',
    color: 'pink'
}, 0, 0, true);
var plat1 = new GameElement(1000 / 3, 100, 0, 600, 0, {
    type: 'rectangle',
    color: 'orange'
}, 0, 0, true);
var plat2 = new GameElement(1000 / 3, 100, 1000 / 3 * 2 / 2, 300, 0, {
    type: 'rectangle',
    color: 'blue'
}, 0, 0, true);
for (var _i = 0, CollisionObjects_1 = CollisionObjects; _i < CollisionObjects_1.length; _i++) {
    var i = CollisionObjects_1[_i];
    i.y += 250;
    i.x += 250;
}
var player = new Player(250, 1050, true);
var m0 = new _M00(250, 1050);
var area = new Area([ground, wallLeft, wallRight, plat1, plat2, m0, player], new AreaCamera(player.x - (750 - player.width / 2), player.y - (750 - player.height / 2), 1500, 1500));
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
    var actionUsed = false;
    if (player.isJumping && player.action !== Actions.jumping)
        player.setAction(Actions.jumping);
    for (var _i = 0, activeKeys_1 = activeKeys; _i < activeKeys_1.length; _i++) {
        var key = activeKeys_1[_i];
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
var move_interval = setInterval(move, 1000 / move_rate);
var draw_interval = setInterval(draw, 1000 / draw_rate);
document.addEventListener('keydown', function (e) { if (activeKeys.indexOf(e.keyCode) === -1)
    activeKeys.push(e.keyCode); });
document.addEventListener('keyup', function (e) { if (activeKeys.indexOf(e.keyCode) !== -1)
    activeKeys.splice(activeKeys.indexOf(e.keyCode), 1); });
