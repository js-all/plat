"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @class - les elements du jeu
 */
var GameElemement = /** @class */ (function () {
    function GameElemement(width, height, x, y, life, style, fx, fy, onDamage, onDeath) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDeath === void 0) { onDeath = function () { }; }
        //definition des proprierter et verrification de type et de valeur si besoin
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.life = life;
        this.maxLife = life;
        this.style = style;
        if ((this.style.type === 'rectangle' || this.style.type === 'path') && this.style.color === undefined)
            throw new TypeError('GameElement, you must provide a color in style if you use a rectangle or path style type');
        if ((this.style.type === 'image') && this.style.IMGPath === undefined)
            throw new TypeError('GameElement, you must provide an IMGPath in style if you use a image style type');
        if (this.style.type === 'path') {
            if (this.style.points === undefined)
                throw new TypeError('GameElement, you must provide points when you use a path style type');
            for (var _i = 0, _a = this.style.points; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.length !== 2)
                    throw new TypeError('GameElement, the points array is an array of array of numbers with a length of two');
            }
        }
        this.fx = fx;
        this.fy = fy;
        this.callOnDamage = onDamage;
        this.callOnDeath = onDeath;
    }
    /**
     * dessine l'element
     * @param ctx - le context sur lequel dessiner.
     */
    GameElemement.prototype.draw = function (ctx) {
        //si son type de style est un rectangle
        if (this.style.type === 'rectangle') {
            var color = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : 'black';
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.style.type === 'image') {
            var resizeIMG = this.style.resiveIMG === undefined ? true : this.style.resiveIMG;
            var img = pathToImage(this.style.IMGPath);
            if (resizeIMG) {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            }
            else {
                ctx.drawImage(img, this.x, this.y);
            }
        }
        else if (this.style.type === 'path') {
            var color = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : 'black';
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            var points = [];
            var temp_points = this.style.points;
            for (var _i = 0, temp_points_1 = temp_points; _i < temp_points_1.length; _i++) {
                var i = temp_points_1[_i];
                var temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            var p = points;
            ctx.beginPath();
            ctx.moveTo.apply(ctx, p[0]);
            ctx.lineTo.apply(ctx, p[0]);
            for (var _a = 0, p_1 = p; _a < p_1.length; _a++) {
                var i = p_1[_a];
                ctx.lineTo.apply(ctx, i);
            }
            var closePath = this.style.closePath === undefined ? true : this.style.closePath;
            if (closePath)
                ctx.lineTo.apply(ctx, p[0]);
            ctx.stroke();
            var fill = this.style.fill === undefined ? false : this.style.fill;
            if (fill)
                ctx.fill();
            ctx.closePath();
            var showPoints = this.style.showPoints === undefined ? false : this.style.showPoints;
            if (showPoints) {
                for (var i = 0; i < p.length; i++) {
                    var e = p[i];
                    var color_1 = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)';
                    ctx.fillStyle = color_1;
                    ctx.beginPath();
                    ctx.arc(e[0], e[1], 5, 0, Math.PI * 2);
                    ctx.font = '15px Arial';
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    ctx.fillText((i + 1).toString(), e[0] - 5, e[1] - 7);
                    ctx.closePath();
                }
            }
        }
    };
    GameElemement.prototype.move = function () {
        this.x += this.fx;
        this.y += this.fy;
    };
    GameElemement.prototype.touch = function (gameElement) {
        var X = false;
        var Y = false;
        if (gameElement.x <= this.width + this.x && gameElement.x >= this.x)
            X = true;
        if (gameElement.y <= this.height + this.y && gameElement.y + gameElement.height >= this.y)
            Y = true;
        return X && Y;
    };
    return GameElemement;
}());
var Orientation;
(function (Orientation) {
    Orientation[Orientation["left"] = 0] = "left";
    Orientation[Orientation["right"] = 1] = "right";
})(Orientation || (Orientation = {}));
var Actions;
(function (Actions) {
    Actions[Actions["jumping"] = 0] = "jumping";
    Actions[Actions["walking"] = 1] = "walking";
    Actions[Actions["attacking"] = 2] = "attacking";
    Actions[Actions["nothing"] = 3] = "nothing";
})(Actions || (Actions = {}));
var GameEntity = /** @class */ (function (_super) {
    __extends(GameEntity, _super);
    function GameEntity(width, height, x, y, life, sprites, fx, fy, orientation, onDamage, onDeath) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (orientation === void 0) { orientation = Orientation.right; }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDeath === void 0) { onDeath = function () { }; }
        var _this = _super.call(this, width, height, x, y, life, {
            type: 'image',
            IMGPath: ''
        }, fx, fy, onDamage, onDeath) || this;
        _this.animeFrame = 0;
        _this.maxAnimeFrame = 0;
        _this.orientation = orientation;
        _this.isWalking = false;
        var walkingSprites = {
            left: [],
            right: []
        };
        var jumpingSprites = {
            left: [],
            right: []
        };
        var attackingSprites = {
            left: [],
            right: []
        };
        var nothingSprites = {
            left: [],
            right: []
        };
        for (var _i = 0, _a = sprites.walking.spritesPath; _i < _a.length; _i++) {
            var i = _a[_i];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            walkingSprites.left.push(imgL);
            walkingSprites.right.push(imgR);
        }
        var walkingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.walking.animeTime);
        for (var i = 1; i < walkingSpritesTime; i++) {
            walkingSprites.left.push(walkingSprites.left[i - 1]);
            walkingSprites.right.push(walkingSprites.right[i - 1]);
        }
        for (var _b = 0, _c = sprites.jumping.spritesPath; _b < _c.length; _b++) {
            var i = _c[_b];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            jumpingSprites.left.push(imgL);
            jumpingSprites.right.push(imgR);
        }
        var jumpingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.jumping.animeTime);
        for (var i = 1; i < jumpingSpritesTime; i++) {
            jumpingSprites.left.push(jumpingSprites.left[i - 1]);
            jumpingSprites.right.push(jumpingSprites.right[i - 1]);
        }
        for (var _d = 0, _e = sprites.attacking.spritesPath; _d < _e.length; _d++) {
            var i = _e[_d];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            attackingSprites.left.push(imgL);
            attackingSprites.right.push(imgR);
        }
        var attackingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.attacking.animeTime);
        for (var i = 1; i < attackingSpritesTime; i++) {
            attackingSprites.left.push(attackingSprites.left[i - 1]);
            attackingSprites.right.push(attackingSprites.right[i - 1]);
        }
        for (var _f = 0, _g = sprites.nothing.spritesPath; _f < _g.length; _f++) {
            var i = _g[_f];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            nothingSprites.left.push(imgL);
            nothingSprites.right.push(imgR);
        }
        var nothingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.nothing.animeTime);
        for (var i = 1; i < nothingSpritesTime; i++) {
            nothingSprites.left.push(nothingSprites.left[i - 1]);
            nothingSprites.right.push(nothingSprites.right[i - 1]);
        }
        _this.sprites = {
            walking: {
                sprites: walkingSprites,
                animeTime: sprites.walking.animeTime
            },
            jumping: {
                sprites: jumpingSprites,
                animeTime: sprites.jumping.animeTime
            },
            attacking: {
                sprites: attackingSprites,
                animeTime: sprites.attacking.animeTime
            },
            nothing: {
                sprites: nothingSprites,
                animeTime: sprites.nothing.animeTime
            }
        };
        _this.action = Actions.nothing;
        _this._sprite = new Image();
        return _this;
    }
    GameEntity.prototype.move = function () {
        this.x += this.fx;
        this.y += this.fy;
    };
    Object.defineProperty(GameEntity.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        set: function (value) {
            this._sprite = value;
            this.style.IMGPath = value.src;
        },
        enumerable: true,
        configurable: true
    });
    GameEntity.prototype.setAction = function (action) {
        this.action = action;
        this.animeFrame = 0;
    };
    GameEntity.prototype.anime = function () {
        if (this.action === Actions.attacking) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.attacking.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.attacking.sprites.right[this.animeFrame];
        }
        else if (this.action === Actions.walking) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.walking.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.walking.sprites.right[this.animeFrame];
        }
        else if (this.action === Actions.jumping) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.jumping.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.jumping.sprites.right[this.animeFrame];
        }
        else if (this.action === Actions.nothing) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.nothing.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.nothing.sprites.right[this.animeFrame];
        }
        this.animeFrame = this.animeFrame >= this.maxAnimeFrame ? 0 : this.animeFrame + 1;
    };
    GameEntity.maxAnimeTime = 10000;
    return GameEntity;
}(GameElemement));
