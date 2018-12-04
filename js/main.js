"use strict";
var canvas = document.createElement('canvas');
var cw = 1000;
var ch = 1000;
var ctx = canvas.getContext('2d');
var draw_rate = 30;
var move_rate = 30;
document.body.appendChild(canvas);
canvas.width = cw;
canvas.height = ch;
ctx.imageSmoothingEnabled = false;
var player = new GameElemement(100, 100, 0, 100, 1, {
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
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    player.draw(ctx);
}
function move() {
    player.move();
}
var move_interval = setInterval(move, 1000 / move_rate);
var draw_interval = setInterval(draw, 1000 / draw_rate);
