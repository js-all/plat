//interface pour les style des elements
const { log } = console;
interface GameElemementStyleInterface<T extends "rectangle" | "image" | "path"> {
    type: T,
    points?: T extends "path" ? Array<[number, number]> : undefined,
    color?: T extends "path" | "rectangle" ? string | rgb : undefined,
    fill?: T extends "path" ? boolean : undefined,
    IMGPath?: T extends "image" ? string : undefined,
    resiveIMG?: T extends "image" ? boolean : undefined,
    showPoints?: T extends "path" ? boolean : undefined,
    closePath?: T extends "path" ? boolean : undefined
}

interface detailTouchInterface {
    res: boolean,
    face: Face,
    superposed: boolean
}

enum Face {
    top, left, right, bottom
}

/**
 * @class les elements du jeu
 */
class GameElemement {
    //la largeur de l'element
    width: number;
    //la hauteur de l'element
    height: number;
    //l'absice de l'element
    x: number;
    //m'ordoné de l'element
    y: number;
    //la vie de l'element
    life: number;
    //la vie maximum de l'element
    maxLife: number;
    //la force x de l'element
    fx: number;
    //la force y de l'element
    fy: number;
    //la fonction apllé quand l'element perd de la vie
    callOnDamage: Function;
    //la fonction appelé a la mort de l'element
    callOnDeath: Function;
    //le style de l'element
    style: GameElemementStyleInterface<"image" | "path" | "rectangle">;

    showHitBox: boolean;

    hitBoxColor: rgb | string;

    collision: boolean = false;

    constructor(width: number, height: number, x: number, y: number, life: number, style: GameElemementStyleInterface<"image" | "path" | "rectangle">, fx: number = 0, fy: number = 0, collision: boolean = false, showHitBox: boolean = false, hitBoxColor: rgb = rgb.random(), onDamage: Function = function () { }, onDeath: Function = function () { }) {
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
        if (collision) CollisionObjects.push(this);
        if ((this.style.type === 'rectangle' || this.style.type === 'path') && this.style.color === undefined) throw new TypeError('GameElement, you must provide a color in style if you use a rectangle or path style type')
        if ((this.style.type === 'image') && this.style.IMGPath === undefined) throw new TypeError('GameElement, you must provide an IMGPath in style if you use a image style type')
        if (this.style.type === 'path') {
            if (this.style.points === undefined) throw new TypeError('GameElement, you must provide points when you use a path style type')
            for (let i of this.style.points) {
                if (i.length !== 2) throw new TypeError('GameElement, the points array is an array of array of numbers with a length of two');
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
    draw(ctx: CanvasRenderingContext2D): void {
        //si son type de style est un rectangle
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        if (this.style.type === 'rectangle') {
            let color: string = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : 'black';
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height)
        } else if (this.style.type === 'image') {
            let resizeIMG: boolean = this.style.resiveIMG === undefined ? true : this.style.resiveIMG;
            let img = pathToImage(<string>this.style.IMGPath);
            if (resizeIMG) {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            } else {
                ctx.drawImage(img, this.x, this.y)
            }
        } else if (this.style.type === 'path') {
            let color: string = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : 'black';
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            let points: Array<[number, number]> = [];
            let temp_points: Array<[number, number]> = <Array<[number, number]>>this.style.points;
            for (let i of temp_points) {
                let temp_array: [number, number] = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            let p: Array<[number, number]> = points;
            ctx.beginPath()
            ctx.moveTo(...p[0]);
            ctx.lineTo(...p[0]);
            for (let i of p) {
                ctx.lineTo(...i);
            }
            let closePath = this.style.closePath === undefined ? true : this.style.closePath;
            if (closePath) ctx.lineTo(...p[0]);
            ctx.stroke();
            let fill: boolean = this.style.fill === undefined ? false : this.style.fill;
            if (fill) ctx.fill()
            ctx.closePath();
            let showPoints = this.style.showPoints === undefined ? false : this.style.showPoints;
            if (showPoints) {
                for (let i = 0; i < p.length; i++) {
                    const e = p[i];
                    const color = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)'
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(e[0], e[1], 5, 0, Math.PI * 2);
                    ctx.font = '15px Arial';
                    ctx.fill();
                    ctx.fillStyle = 'black'
                    ctx.fillText((i + 1).toString(), e[0] - 5, e[1] - 7);
                    ctx.closePath();
                }
            }
        }
    }
    move() {
        this.x += this.fx;
        this.y += this.fy;
    }
    touch<bol extends true | false>(gameElement: GameElemement, detail: bol): bol extends false ? boolean : detailTouchInterface {
        return GameElemement.touch(this.width, this.height, this.x, this.y, gameElement.width, gameElement.height, gameElement.x, gameElement.y, detail);
    }
    
    static touch <bol extends true | false>(width :number, height :number, x :number, y :number, gWidth :number, gHeight :number, gX :number, gY :number, detail: bol): bol extends false ? boolean : detailTouchInterface {
        let X: boolean = false;
        let Y: boolean = false;
        if (gX <= width + x && gX + gWidth >= x) X = true;
        if (gY <= height + y && gY + gHeight >= y) Y = true;
        if (detail) {
            let face: Face = Face.top;
            let superposed: boolean = (x === gX + gWidth || x + width === gX || y === gY + gHeight || y + height === gY);
            superposed = superposed ? false : true;
            let collideLarg = (gX + gWidth <= width + x ? gWidth + gX : x + width) - (gX >= x ? gX : x);
            let collideLong = (gY + gHeight <= y + height ? gY + gHeight : y + height) - (gY >= y ? gY : y);
            if (collideLarg >= collideLong) {
                if (y + (height / 2) <= gY + (gHeight / 2)) {
                    face = Face.top;
                } else {
                    face = Face.bottom
                }
            } else if (collideLong > collideLarg) {
                if (x + (width / 2) <= gX + (gWidth / 2)) {
                    face = Face.left;
                } else {
                    face = Face.right;
                }
            }
            let res: detailTouchInterface = {
                res: X && Y,
                face: face,
                superposed: superposed
            }
            return <bol extends false ? boolean : detailTouchInterface>res;
        }
        let res = X && Y;
        return <bol extends false ? boolean : detailTouchInterface>res;
    }
}

const CollisionObjects: GameElemement[] = [];

enum Orientation {
    left,
    right
}
enum Actions {
    jumping,
    walking,
    attacking,
    nothing
}
interface GameEntitySpriteInterface {
    walking: GameEntityActionSpriteInterface,
    jumping: GameEntityActionSpriteInterface,
    attacking: GameEntityActionSpriteInterface,
    nothing: GameEntityActionSpriteInterface
}
interface GameEntityActionSpriteInterface {
    spritesPath: Array<string>,
    animeTime: number
}
interface GameEntityTrueSpriteInterface {
    walking: GameEntityTrueActionSpriteInterface,
    jumping: GameEntityTrueActionSpriteInterface,
    attacking: GameEntityTrueActionSpriteInterface,
    nothing: GameEntityTrueActionSpriteInterface
}
interface GameEntityTrueActionSpriteInterface {
    sprites: GameEtityTrueActionSpritesSpriteInterface,
    animeTime: number

}
interface GameEtityTrueActionSpritesSpriteInterface {
    left: Array<HTMLImageElement>,
    right: Array<HTMLImageElement>
}
class GameEntity extends GameElemement {
    static maxAnimeTime: number = 10000;
    orientation: Orientation;
    isWalking: boolean;
    sprites: GameEntityTrueSpriteInterface;
    action: Actions;
    animeFrame: number = 0;
    maxAnimeFrame: number = 0;
    _sprite: HTMLImageElement;
    lastAnimeFrame: Date | null = null;
    fj: number = 0;
    isJumping: boolean = false;
    gravity: number = 0;

    constructor(width: number, height: number, x: number, y: number, life: number, sprites: GameEntitySpriteInterface, fx: number = 0, fy: number = 0, orientation: Orientation = Orientation.right, showHitBox: boolean = false, hitBoxColor: rgb = rgb.random(), onDamage: Function = function () { }, onDeath: Function = function () { }) {
        super(width, height, x, y, life, {
            type: 'image',
            IMGPath: ''
        }, fx, fy, false, showHitBox, hitBoxColor, onDamage, onDeath);
        this.orientation = orientation;
        this.isWalking = false;
        let walkingSprites: GameEtityTrueActionSpritesSpriteInterface = {
            left: [],
            right: []
        };
        let jumpingSprites: GameEtityTrueActionSpritesSpriteInterface = {
            left: [],
            right: []
        }
        let attackingSprites: GameEtityTrueActionSpritesSpriteInterface = {
            left: [],
            right: []
        }
        let nothingSprites: GameEtityTrueActionSpritesSpriteInterface = {
            left: [],
            right: []
        }
        for (let i of sprites.walking.spritesPath) {
            let imgR = pathToImage(i)
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
            let imgR = pathToImage(i)
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
            let imgR = pathToImage(i)
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
            let imgR = pathToImage(i)
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
        }
        this.action = Actions.nothing;
        this._sprite = new Image();
        this.anime();
    }
    set sprite(value: HTMLImageElement) {
        this._sprite = value;
        this.style.IMGPath = value.src;
    }
    get sprite(): HTMLImageElement {
        return this._sprite;
    }
    setAction(action: Actions) {
        this.action = action;
        this.animeFrame = 0;
        this.lastAnimeFrame = null;
    }
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
            if (new Date().getTime() - this.lastAnimeFrame.getTime() < time) return;
        }
        if (this.action === Actions.attacking) {
            if (this.orientation === Orientation.left) this.sprite = this.sprites.attacking.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right) this.sprite = this.sprites.attacking.sprites.right[this.animeFrame];
        } else if (this.action === Actions.walking) {
            if (this.orientation === Orientation.left) this.sprite = this.sprites.walking.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right) this.sprite = this.sprites.walking.sprites.right[this.animeFrame];
        } else if (this.action === Actions.jumping) {
            if (this.orientation === Orientation.left) this.sprite = this.sprites.jumping.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right) this.sprite = this.sprites.jumping.sprites.right[this.animeFrame];
        } else if (this.action === Actions.nothing) {
            if (this.orientation === Orientation.left) this.sprite = this.sprites.nothing.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right) this.sprite = this.sprites.nothing.sprites.right[this.animeFrame];
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

    jump(power: number = 50) {
        if (this.isJumping) return;
        this.fj = Math.abs(power);
        this.isJumping = true;
    }

    attack() {
        return console.warn('attack is not defined');
    }

    move() {
        const nfy = 25;
        const ngr = 1;
        let collisions: detailTouchInterface[] = [];
        for (let c of CollisionObjects) {
            collisions.push(this.touch(c, true));
        }
        let touchGround = false;
        for (let c of collisions) {
            if (c.res && c.face === Face.top) touchGround = true;
        }
        for(let i = 0;i < this.fy;i++) {
            let r = this.fx / this.fy;
        }
        this.y += this.fj > 0 ? -this.fj : touchGround ? 0 : this.fy;
        this.x += this.fx;
        collisions = [];
        for (let c of CollisionObjects) {
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
        for (let c of collisions) {
            if (c.res && c.face === Face.top) touchGround = true;
        }
        if (!touchGround) this.isJumping = true;
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
        } else {
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
            if (c.res && c.face === Face.top) touchGround = true;
        }
        if (touchGround) {
            this.isJumping = false;
        }
    }
}

interface GameMovingElemementStyleInterface<T extends "rectangle" | "sprites" | "path"> {
    type: T,
    points?: T extends "path" ? Array<[number, number]> : undefined,
    color?: T extends "path" | "rectangle" ? string | rgb : undefined,
    fill?: T extends "path" ? boolean : undefined,
    spritesPath?: T extends "sprites" ? string[] : undefined,
    onDeathSpritesPath? : T extends "sprites" ? string[] : undefined,
    resiveSprites?: T extends "sprites" ? boolean : undefined,
    animeTime? : T extends "sprites" ? number : undefined,
    showPoints?: T extends "path" ? boolean : undefined,
    closePath?: T extends "path" ? boolean : undefined
}

class GameMovingElement extends GameElemement {
    movingStyle :GameMovingElemementStyleInterface<"sprites" | "rectangle" | "path">;
    sprites :HTMLImageElement[] | null = null;
    deathSprites :HTMLImageElement[] | null = null;
    lastAnimeFrame :Date | null = null;
    animeFrame :number = 0;
    maxAnimeFrame :number = 0.
    _sprite :HTMLImageElement = new Image();
    isAlive :boolean = true;
    static maxAnimeTime :number = 10000;

    constructor(width :number, height :number, x :number, y :number, style :GameMovingElemementStyleInterface<"path" | "rectangle" | "sprites">, fx :number = 0, fy :number = 0, life :number = 1, showHitBox :boolean = false, hitBoxColor : rgb = rgb.random()) {
        super(width, height, x, y, life, {type: 'rectangle', color: 'black'}, fx, fy, false, showHitBox, hitBoxColor);
        this.movingStyle = style;
        if (this.movingStyle.type === 'sprites') {
            this.sprites = [];
            if(this.movingStyle.spritesPath === undefined) throw new TypeError('GameMovingElement, spritesPath must be defined if type is sprites');
            for(let i of this.movingStyle.spritesPath) {
                this.sprites.push(pathToImage(i));
            }
            if (this.movingStyle.onDeathSpritesPath !== undefined) {
                this.deathSprites = [];
                for(let i of this.movingStyle.onDeathSpritesPath) {
                    this.deathSprites.push(pathToImage(i));
                }
            }
        }
    }
    draw(ctx :CanvasRenderingContext2D) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        if (this.movingStyle.type === 'rectangle') {
            let color: string = typeof this.movingStyle.color === 'string' ? this.movingStyle.color : this.movingStyle.color instanceof rgb ? this.movingStyle.color.value : 'black';
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }  else if (this.movingStyle.type === 'path') {
            let color: string = typeof this.movingStyle.color === 'string' ? this.movingStyle.color : this.movingStyle.color instanceof rgb ? this.movingStyle.color.value : 'black';
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            let points: Array<[number, number]> = [];
            let temp_points: Array<[number, number]> = <Array<[number, number]>>this.movingStyle.points;
            for (let i of temp_points) {
                let temp_array: [number, number] = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            let p: Array<[number, number]> = points;
            ctx.beginPath()
            ctx.moveTo(...p[0]);
            ctx.lineTo(...p[0]);
            for (let i of p) {
                ctx.lineTo(...i);
            }
            let closePath = this.movingStyle.closePath === undefined ? true : this.movingStyle.closePath;
            if (closePath) ctx.lineTo(...p[0]);
            ctx.stroke();
            let fill: boolean = this.movingStyle.fill === undefined ? false : this.movingStyle.fill;
            if (fill) ctx.fill()
            ctx.closePath();
            let showPoints = this.movingStyle.showPoints === undefined ? false : this.movingStyle.showPoints;
            if (showPoints) {
                for (let i = 0; i < p.length; i++) {
                    const e = p[i];
                    const color = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)'
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(e[0], e[1], 5, 0, Math.PI * 2);
                    ctx.font = '15px Arial';
                    ctx.fill();
                    ctx.fillStyle = 'black'
                    ctx.fillText((i + 1).toString(), e[0] - 5, e[1] - 7);
                    ctx.closePath();
                }
            }
        } else if(this.movingStyle.type === 'sprites') {
            if(this.movingStyle.resiveSprites || false) {
                ctx.drawImage(this._sprite, this.x, this.y, this.width, this.height);
            } else {
                ctx.drawImage(this._sprite, this.x, this.y);
            }
        }
    }

    anime() {
        if (this.movingStyle.type !== 'sprites') return;
        if (this.sprites === null) return;
        if (this.lastAnimeFrame instanceof Date) {
            let len = 1;
            if (this.isAlive) len = this.sprites.length;
            else if(this.deathSprites !== null) len = this.deathSprites.length;
            if (this.movingStyle.animeTime === undefined) this.movingStyle.animeTime = 100;
            let time :number = this.movingStyle.animeTime;
            if (new Date().getTime() - this.lastAnimeFrame.getTime() < time) return;
        }
        if (this.isAlive) this._sprite = this.sprites[this.animeFrame];
        else if (this.deathSprites !== null) this._sprite = this.deathSprites[this.animeFrame];
        else this._sprite = new Image();
        if (this.isAlive) this.maxAnimeFrame = this.sprites.length - 1;
        else if (this.deathSprites !== null) this.maxAnimeFrame = this.deathSprites.length - 1;
        else this.maxAnimeFrame = 0;
        this.animeFrame = this.animeFrame >= this.maxAnimeFrame ? 1 : this.animeFrame + 1;
        this.lastAnimeFrame = new Date();
    }



    kill() {
        this.life = 0;
        this.isAlive = false;
        this.lastAnimeFrame = null;
        this.animeFrame = 0;
        this.anime();
    }
}

class Player extends GameEntity {
    constructor(x: number, y: number, showHitBox: boolean = false, hitBoxColor: rgb = rgb.random()) {
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
    draw(ctx: CanvasRenderingContext2D) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = typeof this.hitBoxColor === 'string' ? this.hitBoxColor : this.hitBoxColor.value;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        let y = 1;
        ctx.drawImage(pathToImage(this.style.IMGPath || ''), 5, y, 22, 32 - (y), this.x, this.y, this.width, this.height)
    }
}