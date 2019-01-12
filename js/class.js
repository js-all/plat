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
/**
 * les Faces
 */
var Face;
(function (Face) {
    /**
     * la face du haut
     */
    Face[Face["top"] = 0] = "top";
    /**
     * la face de la gauche
     */
    Face[Face["left"] = 1] = "left";
    /**
     * la face de la droite
     */
    Face[Face["right"] = 2] = "right";
    /**
     * la face du bas
     */
    Face[Face["bottom"] = 3] = "bottom";
})(Face || (Face = {}));
/**
 * @class les elements du jeu
 */
var GameElement = /** @class */ (function () {
    /**
     * constructeur de GameElement
     * @param width - la largeur de l'objet
     * @param height - la hauteur de l'objet
     * @param x - l'absice de l'objet
     * @param y - l'ordonée de l'objet
     * @param life - la vie de l'objet
     * @param style - le style de l'objet
     * @param fx - la force y de l'objet
     * @param fy - la force x de l'objet
     * @param collision - indique si l'objet recevra des collisions
     * @param showHitBox - indique si la hitbox de l'objet doit être afficher
     * @param hitBoxColor - la couleure de la hitbox
     * @param onDamage - une fonctino appeler lorsque l'objet prendra des dommage (via la fonction damage)
     * @param onDeath - une fonction appeler quand l'objet mourra, quand sa vie serat a 0 (via la fonctino damage)
     */
    function GameElement(width, height, x, y, life, style, fx, fy, collision, showHitBox, hitBoxColor, onDamage, onDeath) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (collision === void 0) { collision = false; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = rgb.random(); }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDeath === void 0) { onDeath = function () { }; }
        /**
         * dit si l'objet aura des collsions
         */
        this.collision = false;
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
            for (var _a = 0, _b = this.style.points; _a < _b.length; _a++) {
                var i = _b[_a];
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
            for (var _a = 0, temp_points_1 = temp_points; _a < temp_points_1.length; _a++) {
                var i = temp_points_1[_a];
                var temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            var p = points;
            ctx.beginPath();
            ctx.moveTo.apply(ctx, p[0]);
            ctx.lineTo.apply(ctx, p[0]);
            for (var _b = 0, p_1 = p; _b < p_1.length; _b++) {
                var i = p_1[_b];
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
    /**
     * fait bouger l'lement selon les forces x et y qu'il a
     */
    GameElement.prototype.move = function () {
        this.x += this.fx;
        this.y += this.fy;
    };
    /**
     * retourne un boolean ou une detailTouchInterface indiquant si l'element touche oui ou non l'element passé en parametre
     * @param gameElement - l'element testé
     * @param detail - boolean disant si la foction va retourné une detailTouchInteface, ou just boolean, la detailTouchInterface indiquera plus de details que just le boolean
     */
    GameElement.prototype.touch = function (gameElement, detail) {
        return GameElement.touch(this.width, this.height, this.x, this.y, gameElement.width, gameElement.height, gameElement.x, gameElement.y, detail);
    };
    /**
     * retourne un boolean ou une detailTouchInterface indiquant si dans la cas ou il y aurait des element avec les largeurs, heuteurs, ordonées et abscices fourni en parametre ils se toucherait
     * @param width - la largeure de l'element 1
     * @param height - la hauteure de l'element 1
     * @param x - l'abscice de l'element 1
     * @param y - l'ordonée de l'element 1
     * @param gWidth - la largeure de l'element 2
     * @param gHeight - la hauteure de l'element 2
     * @param gX - l'abscice de l'element 2
     * @param gY - l'ordonée de l'element 2
     * @param detail - boolean disant si la foction va retourné une detailTouchInteface, ou just boolean, la detailTouchInterface indiquera plus de details que just le boolean
     */
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
/**
 * les objets a collisions que les GameEntity et autre devront prendre en compte
 */
var CollisionObjects = [];
/**
 * les Orientations
 */
var Orientation;
(function (Orientation) {
    /**
     * l'orientation a gauche
     */
    Orientation[Orientation["left"] = 0] = "left";
    /**
     * l'orientation a droite
     */
    Orientation[Orientation["right"] = 1] = "right";
})(Orientation || (Orientation = {}));
/**
 * les actions
 */
var Actions;
(function (Actions) {
    /**
     * l'action de sauter
     */
    Actions[Actions["jumping"] = 0] = "jumping";
    /**
     * l'action de marcher
     */
    Actions[Actions["walking"] = 1] = "walking";
    /**
     * l'action d'attaquer
     */
    Actions[Actions["attacking"] = 2] = "attacking";
    /**
     * l'action de ne rien faire
     */
    Actions[Actions["nothing"] = 3] = "nothing";
})(Actions || (Actions = {}));
/**
 * les entités vivantes du jeu
 */
var GameEntity = /** @class */ (function (_super) {
    __extends(GameEntity, _super);
    /**
     *
     * @param width - la largeur de l'entité
     * @param height - la hauteur de l'entité
     * @param x - l'absice de l'entité
     * @param y - l'ordonée de l'entité
     * @param life - la vie de lantité
     * @param sprites - les sprites de l'entité
     * @param fx  - la force x de lentité
     * @param fy - la force y de l'entité
     * @param orientation - l'orientation de l'entité
     * @param showHitBox - boolean indiquant si la hit box de l'entité doit être affiché
     * @param hitBoxColor - la couleure de la hitbox de l'entité
     * @param onDamage - une fonctino appeler lorsque l'objet prendra des dommage (via la fonction damage)
     * @param onDeath - une fonction appeler quand l'objet mourra, quand sa vie serat a 0 (via la fonctino damage)
     */
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
        /**
         * la frame ou en est arrivé l'animation
         */
        _this.animeFrame = 0;
        /**
         * le nombre total de frame dans l'animation
         */
        _this.maxAnimeFrame = 0;
        /**
         * la date du dernier moment ou l'entité a été animé
         */
        _this.lastAnimeFrame = null;
        /**
         * la force de saut de l'entité
         */
        _this.fj = 0;
        /**
         * boolean indiquant si l'entité est entrain de sauté
         */
        _this.isJumping = false;
        /**
         * la gravité de lentité
         */
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
        for (var _a = 0, _b = sprites.walking.spritesPath; _a < _b.length; _a++) {
            var i = _b[_a];
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
        for (var _c = 0, _d = sprites.jumping.spritesPath; _c < _d.length; _c++) {
            var i = _d[_c];
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
        for (var _e = 0, _f = sprites.attacking.spritesPath; _e < _f.length; _e++) {
            var i = _f[_e];
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
        for (var _g = 0, _h = sprites.nothing.spritesPath; _g < _h.length; _g++) {
            var i = _h[_g];
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
    /**
     * defini l'action de l'entité et remet a zero l'animatione autre
     * @param action l'action de l'entité
     */
    GameEntity.prototype.setAction = function (action) {
        this.action = action;
        this.animeFrame = 0;
        this.lastAnimeFrame = null;
    };
    /**
     * change le sprites de l'entité pour qu'ile s'anime (a utilisé en boucle)
     */
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
    /**
     * fait sauté l'entité
     * @param power la puissance du saut de l'entité
     */
    GameEntity.prototype.jump = function (power) {
        if (power === void 0) { power = 50; }
        if (this.isJumping)
            return;
        this.fj = Math.abs(power);
        this.isJumping = true;
    };
    /**
     * fait attacké l'entité (a redefinire)
     */
    GameEntity.prototype.attack = function () {
        return console.warn('attack is not defined');
    };
    /**
     * fait bougé l'entité selon ses forces x et y en applicants les coliisions et la gravité
     */
    GameEntity.prototype.move = function () {
        var nfy = 25;
        var ngr = 1;
        var collisions = [];
        for (var _a = 0, CollisionObjects_1 = CollisionObjects; _a < CollisionObjects_1.length; _a++) {
            var c = CollisionObjects_1[_a];
            collisions.push(this.touch(c, true));
        }
        var touchGround = false;
        for (var _b = 0, collisions_1 = collisions; _b < collisions_1.length; _b++) {
            var c = collisions_1[_b];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (touchGround)
            this.fy = 0;
        var fff = false;
        var winnerIndex = 0;
        var _i = 0;
        /*for (let c of CollisionObjects) {
            const d = CollisionObjects[winnerIndex];
            let Y, X = false;
            if (this.fy > 0) {
                if ((this.fy + this.height + this.y) - (c.y) > (this.fy + this.height + this.y) - (d.y) &&
                    (c.y + c.height) - (this.y + this.height) < (d.y + d.height) - (this.y + this.height))
                    Y = true;
            } else if (this.fy <= 0) {
                if ((c.height + c.y) - (this.fy + this.y) > (d.height + d.y) - (this.fy + this.y) &&
                    (c.y) - (this.y + this.fy + this.height) > (d.y) - (this.y + this.fy + this.height))
                    Y = true;
            }
            if (Y) {
                if (this.fx > 0) {
                    if (c.x + c.width >= this.x + this.width && c.x <= this.x + this.fx + this.width) X = true;
                } else if (this.fx <= 0) {
                    if (c.x <= this.x && c.x + c.width >= this.x + this.fx) X = true;
                }
            }
            if (X && Y) winnerIndex = _i;
            _i++;
        }*/
        this.y += this.fj > 0 ? -this.fj : touchGround ? 0 : this.fy;
        this.x += this.fx;
        collisions = [];
        for (var _c = 0, CollisionObjects_2 = CollisionObjects; _c < CollisionObjects_2.length; _c++) {
            var c = CollisionObjects_2[_c];
            collisions.push(this.touch(c, true));
        }
        for (var _d = 0, collisions_2 = collisions; _d < collisions_2.length; _d++) {
            var c = collisions_2[_d];
            if (c.res && c.face === Face.left && c.superposed) {
                this.x = CollisionObjects[collisions.indexOf(c)].x - this.width;
            }
            else if (c.res && c.face === Face.right && c.superposed) {
                this.x = CollisionObjects[collisions.indexOf(c)].x + CollisionObjects[collisions.indexOf(c)].width;
            }
            else if (c.res && c.face === Face.top && c.superposed) {
                this.y = CollisionObjects[collisions.indexOf(c)].y - this.height;
            }
        }
        touchGround = false;
        for (var _e = 0, collisions_3 = collisions; _e < collisions_3.length; _e++) {
            var c = collisions_3[_e];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (!touchGround)
            this.isJumping = true;
        if (this.fj > 0) {
            this.fj -= this.gravity;
            this.gravity += 1;
            for (var _f = 0, collisions_4 = collisions; _f < collisions_4.length; _f++) {
                var c = collisions_4[_f];
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
        for (var _g = 0, collisions_5 = collisions; _g < collisions_5.length; _g++) {
            var c = collisions_5[_g];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (touchGround) {
            this.isJumping = false;
        }
    };
    /**
     * la duré maximal d'animaation
     */
    GameEntity.maxAnimeTime = 10000;
    return GameEntity;
}(GameElement));
/**
 * les entité servent au attaques et autre
 */
var GameMovingElement = /** @class */ (function (_super) {
    __extends(GameMovingElement, _super);
    /**
     *
     * @param width - la largeur de l'entité
     * @param height - la hauteur de l'entité
     * @param x - l'absice de l'entité
     * @param y - l'ordonée de l'entité
     * @param fx  - la force x de lentité
     * @param fy - la force y de l'entité
     * @param life - la vie de lantité
     * @param showHitBox - bolean indiquant si la hitbox de l'entité doit êter afficher
     * @param hitBoxColor - la couelure de la hitbox
     */
    function GameMovingElement(width, height, x, y, style, fx, fy, life, showHitBox, hitBoxColor) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (life === void 0) { life = 1; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = rgb.random(); }
        var _this = _super.call(this, width, height, x, y, life, { type: 'rectangle', color: 'black' }, fx, fy, false, showHitBox, hitBoxColor) || this;
        /**
         * les sprites de l'entité
         */
        _this.sprites = null;
        /**
         * les sprites de l'animation de la mort de l'entité
         */
        _this.deathSprites = null;
        /**
         * la date du dernier moment ou l'entité a été animé
         */
        _this.lastAnimeFrame = null;
        /**
         * la frame ou en est arrivé l'animation
         */
        _this.animeFrame = 0;
        /**
         * le nombre total de frame de l'animation
         */
        _this.maxAnimeFrame = 0;
        /**
         * le sprite actuelle de l'animation
         */
        _this._sprite = new Image();
        /**
         * bolean indiquant si l'entité est en vie
         */
        _this.isAlive = true;
        _this.movingStyle = style;
        if (_this.movingStyle.type === 'sprites') {
            _this.sprites = [];
            if (_this.movingStyle.spritesPath === undefined)
                throw new TypeError('GameMovingElement, spritesPath must be defined if type is sprites');
            for (var _a = 0, _b = _this.movingStyle.spritesPath; _a < _b.length; _a++) {
                var i = _b[_a];
                _this.sprites.push(pathToImage(i));
            }
            if (_this.movingStyle.onDeathSpritesPath !== undefined) {
                _this.deathSprites = [];
                for (var _c = 0, _d = _this.movingStyle.onDeathSpritesPath; _c < _d.length; _c++) {
                    var i = _d[_c];
                    _this.deathSprites.push(pathToImage(i));
                }
            }
        }
        return _this;
    }
    /**
     * dessine l'élement
     * @param ctx - le context sur lequelle m'element doit être dessiné
     */
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
            for (var _a = 0, temp_points_2 = temp_points; _a < temp_points_2.length; _a++) {
                var i = temp_points_2[_a];
                var temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            var p = points;
            ctx.beginPath();
            ctx.moveTo.apply(ctx, p[0]);
            ctx.lineTo.apply(ctx, p[0]);
            for (var _b = 0, p_2 = p; _b < p_2.length; _b++) {
                var i = p_2[_b];
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
    /**
     * change le sprites de l'entité pour qu'ile s'anime (a utilisé en boucle)
     */
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
    /**
     * tue l'element
     */
    GameMovingElement.prototype.kill = function () {
        this.life = 0;
        this.isAlive = false;
        this.lastAnimeFrame = null;
        this.animeFrame = 0;
        this.anime();
    };
    /**
     * la duré maximal d'animaation
     */
    GameMovingElement.maxAnimeTime = 10000;
    return GameMovingElement;
}(GameElement));
var _M00 = /** @class */ (function (_super) {
    __extends(_M00, _super);
    function _M00(x, y) {
        var _this = _super.call(this, 100, 100, x, y, 2, {
            walking: {
                spritesPath: [
                    './images/sprites/monsters/00/walking/0.png',
                    './images/sprites/monsters/00/walking/1.png',
                    './images/sprites/monsters/00/walking/2.png'
                ],
                animeTime: 500
            },
            jumping: {
                spritesPath: [
                    './images/sprites/monsters/00/jumping/0.png',
                    './images/sprites/monsters/00/jumping/1.png'
                ],
                animeTime: 500
            },
            attacking: {
                spritesPath: [
                    './images/sprites/monsters/00/attacking/0.png',
                    './images/sprites/monsters/00/attacking/1.png'
                ],
                animeTime: 1000
            },
            nothing: {
                spritesPath: [
                    './images/sprites/monsters/00/nothing/0.png',
                    './images/sprites/monsters/00/nothing/1.png'
                ],
                animeTime: 1000
            }
        }) || this;
        MonstersElement.push(_this);
        return _this;
    }
    _M00.prototype.follow = function () {
        var maxFX = 10;
    };
    return _M00;
}(GameEntity));
var MonstersElement = [];
var Monster = {
    Monsters: [
        _M00
    ],
    Monbi: _M00
};
/**
 * la class de joueure
 */
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    /**
     * crée un nouvean joueure
     * @param x - l'absice du joueure
     * @param y - l'ordoné du joueure
     * @param showHitBox - boolean indiquan si la hitbox du joueure doit être afficher
     * @param hitBoxColor - la couleure de la hitbox
     */
    function Player(x, y, showHitBox, hitBoxColor) {
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = rgb.random(); }
        return _super.call(this, 68.75, 93.75, x, y, 10, {
            walking: {
                spritesPath: [
                    "./images/sprites/player/walking/0.png",
                    "./images/sprites/player/walking/1.png",
                    "./images/sprites/player/walking/2.png",
                    "./images/sprites/player/walking/3.png"
                ],
                animeTime: 1000
            },
            jumping: {
                spritesPath: [
                    "./images/sprites/player/jumping/0.png"
                ],
                animeTime: 1000
            },
            attacking: {
                spritesPath: [
                    "./images/sprites/player/attacking/0.png"
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
    /**
     * dessine le joueure
     * @param ctx - le context sur le quelle dessiner le joueure
     */
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
