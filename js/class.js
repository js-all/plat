"use strict";
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
class GameElement {
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
    constructor(width, height, x, y, life, style, fx = 0, fy = 0, collision = false, showHitBox = false, hitBoxColor = rgb.random(), onDamage = function () { }, onDeath = function () { }) {
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
            for (let i of this.style.points) {
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
    draw(ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        if (this.style.type === 'rectangle') {
            let color = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : 'black';
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.style.type === 'image') {
            let resizeIMG = this.style.resiveIMG === undefined ? true : this.style.resiveIMG;
            let img = pathToImage(this.style.IMGPath);
            if (resizeIMG) {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            }
            else {
                ctx.drawImage(img, this.x, this.y);
            }
        }
        else if (this.style.type === 'path') {
            let color = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : 'black';
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            let points = [];
            let temp_points = this.style.points;
            for (let i of temp_points) {
                let temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            let p = points;
            ctx.beginPath();
            ctx.moveTo(...p[0]);
            ctx.lineTo(...p[0]);
            for (let i of p) {
                ctx.lineTo(...i);
            }
            let closePath = this.style.closePath === undefined ? true : this.style.closePath;
            if (closePath)
                ctx.lineTo(...p[0]);
            ctx.stroke();
            let fill = this.style.fill === undefined ? false : this.style.fill;
            if (fill)
                ctx.fill();
            ctx.closePath();
            let showPoints = this.style.showPoints === undefined ? false : this.style.showPoints;
            if (showPoints) {
                for (let i = 0; i < p.length; i++) {
                    const e = p[i];
                    const color = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)';
                    ctx.fillStyle = color;
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
    }
    /**
     * fait bouger l'lement selon les forces x et y qu'il a
     */
    move() {
        this.x += this.fx;
        this.y += this.fy;
    }
    /**
     * retourne un boolean ou une detailTouchInterface indiquant si l'element touche oui ou non l'element passé en parametre
     * @param gameElement - l'element testé
     * @param detail - boolean disant si la foction va retourné une detailTouchInteface, ou just boolean, la detailTouchInterface indiquera plus de details que just le boolean
     */
    touch(gameElement, detail) {
        return GameElement.touch(this.width, this.height, this.x, this.y, gameElement.width, gameElement.height, gameElement.x, gameElement.y, detail);
    }
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
    static touch(width, height, x, y, gWidth, gHeight, gX, gY, detail) {
        let X = false;
        let Y = false;
        if (gX <= width + x && gX + gWidth >= x)
            X = true;
        if (gY <= height + y && gY + gHeight >= y)
            Y = true;
        if (detail) {
            let face = Face.top;
            let superposed = (x === gX + gWidth || x + width === gX || y === gY + gHeight || y + height === gY);
            superposed = superposed ? false : true;
            let collideLarg = (gX + gWidth <= width + x ? gWidth + gX : x + width) - (gX >= x ? gX : x);
            let collideLong = (gY + gHeight <= y + height ? gY + gHeight : y + height) - (gY >= y ? gY : y);
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
            let res = {
                res: X && Y,
                face: face,
                superposed: superposed
            };
            return res;
        }
        let res = X && Y;
        return res;
    }
}
/**
 * les objets a collisions que les GameEntity et autre devront prendre en compte
 */
const CollisionObjects = [];
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
class GameEntity extends GameElement {
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
    constructor(width, height, x, y, life, sprites, fx = 0, fy = 0, orientation = Orientation.right, showHitBox = false, hitBoxColor = rgb.random(), onDamage = function () { }, onDeath = function () { }) {
        super(width, height, x, y, life, {
            type: 'image',
            IMGPath: ''
        }, fx, fy, false, showHitBox, hitBoxColor, onDamage, onDeath);
        /**
         * la frame ou en est arrivé l'animation
         */
        this.animeFrame = 0;
        /**
         * le nombre total de frame dans l'animation
         */
        this.maxAnimeFrame = 0;
        /**
         * la date du dernier moment ou l'entité a été animé
         */
        this.lastAnimeFrame = null;
        /**
         * la force de saut de l'entité
         */
        this.fj = 0;
        /**
         * boolean indiquant si l'entité est entrain de sauté
         */
        this.isJumping = false;
        /**
         * la gravité de lentité
         */
        this.gravity = 0;
        this.orientation = orientation;
        this.isWalking = false;
        let walkingSprites = {
            left: [],
            right: []
        };
        let jumpingSprites = {
            left: [],
            right: []
        };
        let attackingSprites = {
            left: [],
            right: []
        };
        let nothingSprites = {
            left: [],
            right: []
        };
        for (let i of sprites.walking.spritesPath) {
            let imgR = pathToImage(i);
            let imgL = rotateImageOnYaxis(imgR);
            walkingSprites.left.push(imgL);
            walkingSprites.right.push(imgR);
        }
        let walkingSpritesTime = Math.round((walkingSprites.right.length / sprites.walking.animeTime) * GameEntity.maxAnimeTime);
        for (let i = 1; i < walkingSpritesTime; i++) {
            walkingSprites.left.push(walkingSprites.left[i - 1]);
            walkingSprites.right.push(walkingSprites.right[i - 1]);
        }
        for (let i of sprites.jumping.spritesPath) {
            let imgR = pathToImage(i);
            let imgL = rotateImageOnYaxis(imgR);
            jumpingSprites.left.push(imgL);
            jumpingSprites.right.push(imgR);
        }
        let jumpingSpritesTime = Math.round((jumpingSprites.right.length / sprites.jumping.animeTime) * GameEntity.maxAnimeTime);
        for (let i = 1; i < jumpingSpritesTime; i++) {
            jumpingSprites.left.push(jumpingSprites.left[i - 1]);
            jumpingSprites.right.push(jumpingSprites.right[i - 1]);
        }
        for (let i of sprites.attacking.spritesPath) {
            let imgR = pathToImage(i);
            let imgL = rotateImageOnYaxis(imgR);
            attackingSprites.left.push(imgL);
            attackingSprites.right.push(imgR);
        }
        let attackingSpritesTime = Math.round((attackingSprites.right.length / sprites.attacking.animeTime) * GameEntity.maxAnimeTime);
        for (let i = 1; i < attackingSpritesTime; i++) {
            attackingSprites.left.push(attackingSprites.left[i - 1]);
            attackingSprites.right.push(attackingSprites.right[i - 1]);
        }
        for (let i of sprites.nothing.spritesPath) {
            let imgR = pathToImage(i);
            let imgL = rotateImageOnYaxis(imgR);
            nothingSprites.left.push(imgL);
            nothingSprites.right.push(imgR);
        }
        let nothingSpritesTime = Math.round((nothingSprites.right.length / sprites.nothing.animeTime) * GameEntity.maxAnimeTime);
        for (let i = 1; i < nothingSpritesTime; i++) {
            nothingSprites.left.push(nothingSprites.left[i - 1]);
            nothingSprites.right.push(nothingSprites.right[i - 1]);
        }
        this.sprites = {
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
        this.action = Actions.nothing;
        this._sprite = new Image();
        this.anime();
    }
    set sprite(value) {
        this._sprite = value;
        this.style.IMGPath = value.src;
    }
    get sprite() {
        return this._sprite;
    }
    /**
     * defini l'action de l'entité et remet a zero l'animatione autre
     * @param action l'action de l'entité
     */
    setAction(action) {
        this.action = action;
        this.animeFrame = 0;
        this.lastAnimeFrame = null;
    }
    /**
     * change le sprites de l'entité pour qu'ile s'anime (a utilisé en boucle)
     */
    anime() {
        if (this.lastAnimeFrame instanceof Date) {
            let len = 1;
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
            let time = GameEntity.maxAnimeTime / len;
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
    }
    /**
     * fait sauté l'entité
     * @param power la puissance du saut de l'entité
     */
    jump(power = 50) {
        if (this.isJumping)
            return;
        this.fj = Math.abs(power);
        this.isJumping = true;
    }
    /**
     * fait attacké l'entité (a redefinire)
     */
    attack() {
        return console.warn('attack is not defined');
    }
    /**
     * fait bougé l'entité selon ses forces x et y en applicants les coliisions et la gravité
     */
    move() {
        const nfy = 25;
        const ngr = 1;
        let collisions = [];
        for (let c of CollisionObjects) {
            collisions.push(this.touch(c, true));
        }
        let touchGround = false;
        for (let c of collisions) {
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        let ffx = null;
        let ffy = null;
        let fff = false;
        this.y += fff && ffy !== null ? ffy : this.fj > 0 ? -this.fj : touchGround ? 0 : this.fy;
        this.x += fff && ffx !== null ? ffx : this.fx;
        collisions = [];
        for (let c of CollisionObjects) {
            collisions.push(this.touch(c, true));
        }
        for (let c of collisions) {
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
        for (let c of collisions) {
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (!touchGround)
            this.isJumping = true;
        if (this.fj > 0) {
            this.fj -= this.gravity;
            this.gravity += 1;
            for (let c of collisions) {
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
        for (let c of collisions) {
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (touchGround) {
            this.isJumping = false;
        }
    }
}
/**
 * la duré maximal d'animaation
 */
GameEntity.maxAnimeTime = 10000;
/**
 * les entité servent au attaques et autre
 */
class GameMovingElement extends GameElement {
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
    constructor(width, height, x, y, style, fx = 0, fy = 0, life = 1, showHitBox = false, hitBoxColor = rgb.random()) {
        super(width, height, x, y, life, { type: 'rectangle', color: 'black' }, fx, fy, false, showHitBox, hitBoxColor);
        /**
         * les sprites de l'entité
         */
        this.sprites = null;
        /**
         * les sprites de l'animation de la mort de l'entité
         */
        this.deathSprites = null;
        /**
         * la date du dernier moment ou l'entité a été animé
         */
        this.lastAnimeFrame = null;
        /**
         * la frame ou en est arrivé l'animation
         */
        this.animeFrame = 0;
        /**
         * le nombre total de frame de l'animation
         */
        this.maxAnimeFrame = 0;
        /**
         * le sprite actuelle de l'animation
         */
        this._sprite = new Image();
        /**
         * bolean indiquant si l'entité est en vie
         */
        this.isAlive = true;
        this.movingStyle = style;
        if (this.movingStyle.type === 'sprites') {
            this.sprites = [];
            if (this.movingStyle.spritesPath === undefined)
                throw new TypeError('GameMovingElement, spritesPath must be defined if type is sprites');
            for (let i of this.movingStyle.spritesPath) {
                this.sprites.push(pathToImage(i));
            }
            if (this.movingStyle.onDeathSpritesPath !== undefined) {
                this.deathSprites = [];
                for (let i of this.movingStyle.onDeathSpritesPath) {
                    this.deathSprites.push(pathToImage(i));
                }
            }
        }
    }
    /**
     * dessine l'élement
     * @param ctx - le context sur lequelle m'element doit être dessiné
     */
    draw(ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        if (this.movingStyle.type === 'rectangle') {
            let color = typeof this.movingStyle.color === 'string' ? this.movingStyle.color : this.movingStyle.color instanceof rgb ? this.movingStyle.color.value : 'black';
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.movingStyle.type === 'path') {
            let color = typeof this.movingStyle.color === 'string' ? this.movingStyle.color : this.movingStyle.color instanceof rgb ? this.movingStyle.color.value : 'black';
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            let points = [];
            let temp_points = this.movingStyle.points;
            for (let i of temp_points) {
                let temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            let p = points;
            ctx.beginPath();
            ctx.moveTo(...p[0]);
            ctx.lineTo(...p[0]);
            for (let i of p) {
                ctx.lineTo(...i);
            }
            let closePath = this.movingStyle.closePath === undefined ? true : this.movingStyle.closePath;
            if (closePath)
                ctx.lineTo(...p[0]);
            ctx.stroke();
            let fill = this.movingStyle.fill === undefined ? false : this.movingStyle.fill;
            if (fill)
                ctx.fill();
            ctx.closePath();
            let showPoints = this.movingStyle.showPoints === undefined ? false : this.movingStyle.showPoints;
            if (showPoints) {
                for (let i = 0; i < p.length; i++) {
                    const e = p[i];
                    const color = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)';
                    ctx.fillStyle = color;
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
    }
    /**
     * change le sprites de l'entité pour qu'ile s'anime (a utilisé en boucle)
     */
    anime() {
        if (this.movingStyle.type !== 'sprites')
            return;
        if (this.sprites === null)
            return;
        if (this.lastAnimeFrame instanceof Date) {
            let len = 1;
            if (this.isAlive)
                len = this.sprites.length;
            else if (this.deathSprites !== null)
                len = this.deathSprites.length;
            if (this.movingStyle.animeTime === undefined)
                this.movingStyle.animeTime = 100;
            let time = this.movingStyle.animeTime;
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
    }
    /**
     * tue l'element
     */
    kill() {
        this.life = 0;
        this.isAlive = false;
        this.lastAnimeFrame = null;
        this.animeFrame = 0;
        this.anime();
    }
}
/**
 * la duré maximal d'animaation
 */
GameMovingElement.maxAnimeTime = 10000;
/**
 * la class de joueure
 */
class Player extends GameEntity {
    /**
     * crée un nouvean joueure
     * @param x - l'absice du joueure
     * @param y - l'ordoné du joueure
     * @param showHitBox - boolean indiquan si la hitbox du joueure doit être afficher
     * @param hitBoxColor - la couleure de la hitbox
     */
    constructor(x, y, showHitBox = false, hitBoxColor = rgb.random()) {
        super(68.75, 93.75, x, y, 10, {
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
        }, 0, 0, Orientation.right, showHitBox, hitBoxColor);
    }
    /**
     * dessine le joueure
     * @param ctx - le context sur le quelle dessiner le joueure
     */
    draw(ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        let y = 1;
        ctx.drawImage(pathToImage(this.style.IMGPath || ''), 5, y, 22, 32 - (y), this.x, this.y, this.width, this.height);
    }
}
