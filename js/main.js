"use strict";
var canvas = document.createElement('canvas');
var cw = 1500;
var ch = 1500;
var ctx = canvas.getContext('2d');
var draw_rate = 30;
var move_rate = 30;
var activeKeys = [];
document.body.appendChild(canvas);
canvas.width = cw;
canvas.height = ch;
ctx.imageSmoothingEnabled = false;
var ground = new GameElemement(1000 - 0, 100, 0, 900, 0, {
    type: "rectangle",
    color: rgb.green
}, 0, 0, true);
var wallRight = new GameElemement(100, 1000 - 100, 1000 - 100, 0, 0, {
    type: "rectangle",
    color: 'red'
}, 0, 0, true);
var wallLeft = new GameElemement(100, 600, 0, 0, 0, {
    type: 'rectangle',
    color: 'pink'
}, 0, 0, true);
var plat1 = new GameElemement(1000 / 3, 100, 0, 600, 0, {
    type: 'rectangle',
    color: 'orange'
}, 0, 0, true);
var plat2 = new GameElemement(1000 / 3, 100, 1000 / 3 * 2 / 2, 300, 0, {
    type: 'rectangle',
    color: 'blue'
}, 0, 0, true);
for (var _i = 0, CollisionObjects_1 = CollisionObjects; _i < CollisionObjects_1.length; _i++) {
    var i = CollisionObjects_1[_i];
    i.y += 250;
    i.x += 250;
}
var player = new Player(250, 1050, true);
player.setAction(Actions.walking);
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    for (var _i = 0, CollisionObjects_2 = CollisionObjects; _i < CollisionObjects_2.length; _i++) {
        var i = CollisionObjects_2[_i];
        i.draw(ctx);
    }
    player.draw(ctx);
}
function move() {
    player.anime();
    player.move();
    ground.move();
    player.fx = 0;
    var actionUsed = false;
    if (player.isJumping && player.action !== Actions.jumping)
        player.setAction(Actions.jumping);
    for (var _i = 0, activeKeys_1 = activeKeys; _i < activeKeys_1.length; _i++) {
        var key = activeKeys_1[_i];
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
var move_interval = setInterval(move, 1000 / move_rate);
var draw_interval = setInterval(draw, 1000 / draw_rate);
document.addEventListener('keydown', function (e) { if (activeKeys.indexOf(e.keyCode) === -1)
    activeKeys.push(e.keyCode); });
document.addEventListener('keyup', function (e) { if (activeKeys.indexOf(e.keyCode) !== -1)
    activeKeys.splice(activeKeys.indexOf(e.keyCode), 1); });
