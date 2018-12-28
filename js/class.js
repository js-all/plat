"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//interface pour les style des elements
var log = console.log;
var Face;
(function (Face) {
    Face[Face["top"] = 0] = "top";
    Face[Face["left"] = 1] = "left";
    Face[Face["right"] = 2] = "right";
    Face[Face["bottom"] = 3] = "bottom";
})(Face || (Face = {}));
/**
 * @class les elements du jeu
 */
var GameElement = /** @class */ (function () {
    function GameElement(width, height, x, y, life, style, fx, fy, collision, showHitBox, hitBoxColor, onDamage, onDeath) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (collision === void 0) { collision = false; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = rgb.random(); }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDeath === void 0) { onDeath = function () { }; }
        this.collision = false;
        //definition des proprierter et verrification de type et de valeur si besoin
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.life = life;
        this.maxLife = life;
        this.style = style;
        this.showHitBox = showHitBox;
        this.hitBoxColor = hitBoxColor;
        this.collision = collision;
        if (collision)
            CollisionObjects.push(this);
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
    GameElement.prototype.draw = function (ctx) {
        //si son type de style est un rectangle
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
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
    GameElement.prototype.move = function () {
        this.x += this.fx;
        this.y += this.fy;
    };
    GameElement.prototype.touch = function (gameElement, detail) {
        return GameElement.touch(this.width, this.height, this.x, this.y, gameElement.width, gameElement.height, gameElement.x, gameElement.y, detail);
    };
    GameElement.touch = function (width, height, x, y, gWidth, gHeight, gX, gY, detail) {
        var X = false;
        var Y = false;
        if (gX <= width + x && gX + gWidth >= x)
            X = true;
        if (gY <= height + y && gY + gHeight >= y)
            Y = true;
        if (detail) {
            var face = Face.top;
            var superposed = (x === gX + gWidth || x + width === gX || y === gY + gHeight || y + height === gY);
            superposed = superposed ? false : true;
            var collideLarg = (gX + gWidth <= width + x ? gWidth + gX : x + width) - (gX >= x ? gX : x);
            var collideLong = (gY + gHeight <= y + height ? gY + gHeight : y + height) - (gY >= y ? gY : y);
            if (collideLarg >= collideLong) {
                if (y + (height / 2) <= gY + (gHeight / 2)) {
                    face = Face.top;
                }
                else {
                    face = Face.bottom;
                }
            }
            else if (collideLong > collideLarg) {
                if (x + (width / 2) <= gX + (gWidth / 2)) {
                    face = Face.left;
                }
                else {
                    face = Face.right;
                }
            }
            var res_1 = {
                res: X && Y,
                face: face,
                superposed: superposed
            };
            return res_1;
        }
        var res = X && Y;
        return res;
    };
    return GameElement;
}());
var CollisionObjects = [];
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
    function GameEntity(width, height, x, y, life, sprites, fx, fy, orientation, showHitBox, hitBoxColor, onDamage, onDeath) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (orientation === void 0) { orientation = Orientation.right; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = rgb.random(); }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDeath === void 0) { onDeath = function () { }; }
        var _this = _super.call(this, width, height, x, y, life, {
            type: 'image',
            IMGPath: ''
        }, fx, fy, false, showHitBox, hitBoxColor, onDamage, onDeath) || this;
        _this.animeFrame = 0;
        _this.maxAnimeFrame = 0;
        _this.lastAnimeFrame = null;
        _this.fj = 0;
        _this.isJumping = false;
        _this.gravity = 0;
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
        var walkingSpritesTime = Math.round((walkingSprites.right.length / sprites.walking.animeTime) * GameEntity.maxAnimeTime);
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
        var jumpingSpritesTime = Math.round((jumpingSprites.right.length / sprites.jumping.animeTime) * GameEntity.maxAnimeTime);
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
        var attackingSpritesTime = Math.round((attackingSprites.right.length / sprites.attacking.animeTime) * GameEntity.maxAnimeTime);
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
        var nothingSpritesTime = Math.round((nothingSprites.right.length / sprites.nothing.animeTime) * GameEntity.maxAnimeTime);
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
        _this.anime();
        return _this;
    }
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
        this.lastAnimeFrame = null;
    };
    GameEntity.prototype.anime = function () {
        if (this.lastAnimeFrame instanceof Date) {
            var len = 1;
            switch (this.action) {
                case Actions.nothing:
                    len = this.sprites.nothing.sprites.right.length;
                    break;
                case Actions.walking:
                    len = this.sprites.walking.sprites.right.length;
                    break;
                case Actions.attacking:
                    len = this.sprites.attacking.sprites.right.length;
                    break;
                case Actions.jumping:
                    len = this.sprites.jumping.sprites.right.length;
                    break;
            }
            var time = GameEntity.maxAnimeTime / len;
            if (new Date().getTime() - this.lastAnimeFrame.getTime() < time)
                return;
        }
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
        switch (this.action) {
            case Actions.nothing:
                this.maxAnimeFrame = this.sprites.nothing.sprites.right.length - 1;
                break;
            case Actions.walking:
                this.maxAnimeFrame = this.sprites.walking.sprites.right.length - 1;
                break;
            case Actions.attacking:
                this.maxAnimeFrame = this.sprites.attacking.sprites.right.length - 1;
                break;
            case Actions.jumping:
                this.maxAnimeFrame = this.sprites.jumping.sprites.right.length - 1;
                break;
        }
        this.animeFrame = this.animeFrame >= this.maxAnimeFrame ? 1 : this.animeFrame + 1;
        this.lastAnimeFrame = new Date();
    };
    GameEntity.prototype.jump = function (power) {
        if (power === void 0) { power = 50; }
        if (this.isJumping)
            return;
        this.fj = Math.abs(power);
        this.isJumping = true;
    };
    GameEntity.prototype.attack = function () {
        return console.warn('attack is not defined');
    };
    GameEntity.prototype.move = function () {
        var nfy = 25;
        var ngr = 1;
        var collisions = [];
        for (var _i = 0, CollisionObjects_1 = CollisionObjects; _i < CollisionObjects_1.length; _i++) {
            var c = CollisionObjects_1[_i];
            collisions.push(this.touch(c, true));
        }
        var touchGround = false;
        for (var _a = 0, collisions_1 = collisions; _a < collisions_1.length; _a++) {
            var c = collisions_1[_a];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        var ffx = null;
        var ffy = null;
        var fff = false;
        /*for(let i = 0;i < this.fy;i++) {
            let r = this.fx / this.fy;
            let t :detailTouchInterface = {
                res: false,
                superposed: false,
                face : Face.bottom
            };
            for(let c of CollisionObjects) {
                t = GameElement.touch(this.width, this.height, this.x + i * r, this.y + i, c.width, c.height, c.x, c.y, true);
                if (t.res && !t.superposed) break;
            }

            if (t.res && !t.superposed) {
                ffx = i*r;
                ffy = i;
                fff = true;
                break;
            }
        }*/
        this.y += fff && ffy !== null ? ffy : this.fj > 0 ? -this.fj : touchGround ? 0 : this.fy;
        this.x += fff && ffx !== null ? ffx : this.fx;
        collisions = [];
        for (var _b = 0, CollisionObjects_2 = CollisionObjects; _b < CollisionObjects_2.length; _b++) {
            var c = CollisionObjects_2[_b];
            collisions.push(this.touch(c, true));
        }
        for (let c of collisions) {
            if (c.res && c.face === Face.left && c.superposed) {
                this.x = CollisionObjects[collisions.indexOf(c)].x - this.width;
            } else if (c.res && c.face === Face.right && c.superposed) {
                this.x = CollisionObjects[collisions.indexOf(c)].x + CollisionObjects[collisions.indexOf(c)].width;
            } else if (c.res && c.face === Face.top && c.superposed) {
                this.y = CollisionObjects[collisions.indexOf(c)].y - this.height;
            }
        }
        touchGround = false;
        for (var _c = 0, collisions_2 = collisions; _c < collisions_2.length; _c++) {
            var c = collisions_2[_c];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (!touchGround)
            this.isJumping = true;
        if (this.fj > 0) {
            this.fj -= this.gravity;
            this.gravity += 1;
            for (var _d = 0, collisions_3 = collisions; _d < collisions_3.length; _d++) {
                var c = collisions_3[_d];
                if (c.res && c.face === Face.bottom && c.superposed) {
                    this.fj = -1;
                    this.y = CollisionObjects[collisions.indexOf(c)].y + CollisionObjects[collisions.indexOf(c)].height;
                }
            }
            if (this.fj < 0) {
                this.fj = 0;
                this.fy = 0;
                this.gravity = ngr;
            }
        }
        else {
            if (!touchGround) {
                this.fy += this.gravity;
                this.gravity += 1;
            }
            else {
                this.fy = nfy;
                this.gravity = ngr;
            }
        }
        for (var _e = 0, collisions_4 = collisions; _e < collisions_4.length; _e++) {
            var c = collisions_4[_e];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (touchGround) {
            this.isJumping = false;
        }
    };
    GameEntity.maxAnimeTime = 10000;
    return GameEntity;
}(GameElement));
var GameMovingElement = /** @class */ (function (_super) {
    __extends(GameMovingElement, _super);
    function GameMovingElement(width, height, x, y, style, fx, fy, life, showHitBox, hitBoxColor) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (life === void 0) { life = 1; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = rgb.random(); }
        var _this = _super.call(this, width, height, x, y, life, { type: 'rectangle', color: 'black' }, fx, fy, false, showHitBox, hitBoxColor) || this;
        _this.sprites = null;
        _this.deathSprites = null;
        _this.lastAnimeFrame = null;
        _this.animeFrame = 0;
        _this.maxAnimeFrame = 0.;
        _this._sprite = new Image();
        _this.isAlive = true;
        _this.movingStyle = style;
        if (_this.movingStyle.type === 'sprites') {
            _this.sprites = [];
            if (_this.movingStyle.spritesPath === undefined)
                throw new TypeError('GameMovingElement, spritesPath must be defined if type is sprites');
            for (var _i = 0, _a = _this.movingStyle.spritesPath; _i < _a.length; _i++) {
                var i = _a[_i];
                _this.sprites.push(pathToImage(i));
            }
            if (_this.movingStyle.onDeathSpritesPath !== undefined) {
                _this.deathSprites = [];
                for (var _b = 0, _c = _this.movingStyle.onDeathSpritesPath; _b < _c.length; _b++) {
                    var i = _c[_b];
                    _this.deathSprites.push(pathToImage(i));
                }
            }
        }
        return _this;
    }
    GameMovingElement.prototype.draw = function (ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        if (this.movingStyle.type === 'rectangle') {
            var color = typeof this.movingStyle.color === 'string' ? this.movingStyle.color : this.movingStyle.color instanceof rgb ? this.movingStyle.color.value : 'black';
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.movingStyle.type === 'path') {
            var color = typeof this.movingStyle.color === 'string' ? this.movingStyle.color : this.movingStyle.color instanceof rgb ? this.movingStyle.color.value : 'black';
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            var points = [];
            var temp_points = this.movingStyle.points;
            for (var _i = 0, temp_points_2 = temp_points; _i < temp_points_2.length; _i++) {
                var i = temp_points_2[_i];
                var temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            var p = points;
            ctx.beginPath();
            ctx.moveTo.apply(ctx, p[0]);
            ctx.lineTo.apply(ctx, p[0]);
            for (var _a = 0, p_2 = p; _a < p_2.length; _a++) {
                var i = p_2[_a];
                ctx.lineTo.apply(ctx, i);
            }
            var closePath = this.movingStyle.closePath === undefined ? true : this.movingStyle.closePath;
            if (closePath)
                ctx.lineTo.apply(ctx, p[0]);
            ctx.stroke();
            var fill = this.movingStyle.fill === undefined ? false : this.movingStyle.fill;
            if (fill)
                ctx.fill();
            ctx.closePath();
            var showPoints = this.movingStyle.showPoints === undefined ? false : this.movingStyle.showPoints;
            if (showPoints) {
                for (var i = 0; i < p.length; i++) {
                    var e = p[i];
                    var color_2 = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)';
                    ctx.fillStyle = color_2;
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
        else if (this.movingStyle.type === 'sprites') {
            if (this.movingStyle.resiveSprites || false) {
                ctx.drawImage(this._sprite, this.x, this.y, this.width, this.height);
            }
            else {
                ctx.drawImage(this._sprite, this.x, this.y);
            }
        }
    };
    GameMovingElement.prototype.anime = function () {
        if (this.movingStyle.type !== 'sprites')
            return;
        if (this.sprites === null)
            return;
        if (this.lastAnimeFrame instanceof Date) {
            var len = 1;
            if (this.isAlive)
                len = this.sprites.length;
            else if (this.deathSprites !== null)
                len = this.deathSprites.length;
            if (this.movingStyle.animeTime === undefined)
                this.movingStyle.animeTime = 100;
            var time = this.movingStyle.animeTime;
            if (new Date().getTime() - this.lastAnimeFrame.getTime() < time)
                return;
        }
        if (this.isAlive)
            this._sprite = this.sprites[this.animeFrame];
        else if (this.deathSprites !== null)
            this._sprite = this.deathSprites[this.animeFrame];
        else
            this._sprite = new Image();
        if (this.isAlive)
            this.maxAnimeFrame = this.sprites.length - 1;
        else if (this.deathSprites !== null)
            this.maxAnimeFrame = this.deathSprites.length - 1;
        else
            this.maxAnimeFrame = 0;
        this.animeFrame = this.animeFrame >= this.maxAnimeFrame ? 1 : this.animeFrame + 1;
        this.lastAnimeFrame = new Date();
    };
    GameMovingElement.prototype.kill = function () {
        this.life = 0;
        this.isAlive = false;
        this.lastAnimeFrame = null;
        this.animeFrame = 0;
        this.anime();
    };
    GameMovingElement.maxAnimeTime = 10000;
    return GameMovingElement;
}(GameElement));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y, showHitBox, hitBoxColor) {
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = rgb.random(); }
        return _super.call(this, 68.75, 93.75, x, y, 10, {
            walking: {
                spritesPath: [
                    "./images/sprites/player/walk/0.png",
                    "./images/sprites/player/walk/1.png",
                    "./images/sprites/player/walk/2.png",
                    "./images/sprites/player/walk/3.png"
                ],
                animeTime: 1000
            },
            jumping: {
                spritesPath: [
                    "./images/sprites/player/jump/0.png"
                ],
                animeTime: 1000
            },
            attacking: {
                spritesPath: [
                    "./images/sprites/player/attack/0.png"
                ],
                animeTime: 1000
            },
            nothing: {
                spritesPath: [
                    "./images/sprites/player/nothing/0.png"
                ],
                animeTime: 1000
            }
        }, 0, 0, Orientation.right, showHitBox, hitBoxColor) || this;
    }
    Player.prototype.draw = function (ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        var y = 1;
        ctx.drawImage(pathToImage(this.style.IMGPath || ''), 5, y, 22, 32 - (y), this.x, this.y, this.width, this.height);
    };
    return Player;
}(GameEntity));
