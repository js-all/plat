/**
 * interface du style des GameElements
 */
interface GameElementStyleInterface<T extends "rectangle" | "image" | "path"> {
    /**
     *  le type de style
     */
    type: T,
    /**
     * si type est a "path" les points sur lesquels passé pour faire la figure.
     */
    points?: T extends "path" ? Array<[number, number]> : undefined,
    /**
     * si type est a "path" ou "rectangle" la couleure 
     */
    color?: T extends "path" | "rectangle" ? string | rgb : undefined,
    /**
     * si type est a "path" dis si la figure vas être rempli
     */
    fill?: T extends "path" ? boolean : undefined,
    /**
     * si type est a "image" le chemin ver l'image
     */
    IMGPath?: T extends "image" ? string : undefined,
    /**
     * si type est a "image" indique si l'image doit être changé de taile
     */
    resiveIMG?: T extends "image" ? boolean : undefined,
    /**
     * si type est a "path" indique si draw doit montré prescisément les points
     */
    showPoints?: T extends "path" ? boolean : undefined,
    /**
     * si type est a "path" indique si la figure doit être fermer
     */
    closePath?: T extends "path" ? boolean : undefined
}
/**
 * interface des details renvoiyer par la fondtion touch quand detail est a true
 */
interface detailTouchInterface {
    /**
     * la reponsse, si les élement se touchent
     */
    res: boolean,
    /**
     * la face que l'element touche sur l'element 2
     */
    face: Face,
    /**
     * indique si les elment son superposé, si ils se touchent d'1px, ils ne le sont pas sinon ils le sont
     */
    superposed: boolean
}
/**
 * les Faces
 */
enum Face {
    /**
     * la face du haut
     */
    top,
    /**
     * la face de la gauche
     */
    left,
    /**
     * la face de la droite
     */
    right,
    /**
     * la face du bas
     */
    bottom
}
/**
 * @class les elements du jeu
 */
class GameElement {
    /**
     * la largeur de l'element
    */
    width: number;
    /**
     * la hauteur de l'element
     */
    height: number;
    /**
     * l'absice de l'element
     */
    x: number;
    /**
     * l'ordoné de l'element
     */
    y: number;
    /**
     * la vie de l'element
     */
    life: number;
    /**
     * la vie maximum de l'element
     */
    maxLife: number;
    /**
     * la force x de l'element
     */
    fx: number;
    /**
     * la force y de l'element
     */
    fy: number;
    /**
     * la fonction apllé quand l'element perd de la vie
     */
    callOnDamage: Function;
    /**
     * la fonction appelé a la mort de l'element
     */
    callOnDeath: Function;
    /**
     * le style de l'element
     */
    style: GameElementStyleInterface<"image" | "path" | "rectangle">;
    /**
     * boolean indiquen si la hit box de l'objet doit être afficher
     */
    showHitBox: boolean;
    /**
     * la couleure de la hitbox
     */
    hitBoxColor: rgb | string;
    /**
     * dit si l'objet aura des collsions
     */
    collision: boolean = false;
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
    constructor(width: number, height: number, x: number, y: number, life: number, style: GameElementStyleInterface<"image" | "path" | "rectangle">, fx: number = 0, fy: number = 0, collision: boolean = false, showHitBox: boolean = false, hitBoxColor: rgb = rgb.random(), onDamage: Function = function () { }, onDeath: Function = function () { }) {

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
    touch<bol extends true | false>(gameElement: GameElement, detail: bol): bol extends false ? boolean : detailTouchInterface {
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
    static touch<bol extends true | false>(width: number, height: number, x: number, y: number, gWidth: number, gHeight: number, gX: number, gY: number, detail: bol): bol extends false ? boolean : detailTouchInterface {
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
/**
 * les objets a collisions que les GameEntity et autre devront prendre en compte
 */
const CollisionObjects: GameElement[] = [];
/**
 * les Orientations
 */
enum Orientation {
    /**
     * l'orientation a gauche
     */
    left,
    /**
     * l'orientation a droite
     */
    right
}
/**
 * les actions
 */
enum Actions {
    /**
     * l'action de sauter
     */
    jumping,
    /**
     * l'action de marcher
     */
    walking,
    /**
     * l'action d'attaquer
     */
    attacking,
    /**
     * l'action de ne rien faire
     */
    nothing
}
/**
 * l'interface de sprites de GameEntity a fournire en parametre
 */
interface GameEntitySpriteInterface {
    /**
     * les sprites de l'action de marcher
     */
    walking: GameEntityActionSpriteInterface,
    /**
     * les sprites de l'action de sauter
     */
    jumping: GameEntityActionSpriteInterface,
    /**
     * les sprites de l'action de attaqué
     */
    attacking: GameEntityActionSpriteInterface,
    /**
     * les sprites de l'action de ne rien faire
     */
    nothing: GameEntityActionSpriteInterface
}
/**
 * l'interface d'action de sprite de GameEntitySpriteInteface
 */
interface GameEntityActionSpriteInterface {
    /**
     * les chemin vers les images des sprites
     */
    spritesPath: Array<string>,
    /**
     * la duré de l'animation
     */
    animeTime: number
}
/**
 * l'interface de sprite de GameEntity utilisé par les methodes
 */
interface GameEntityTrueSpriteInterface {
    /**
     * les sprites de l'action de marcher
     */
    walking: GameEntityTrueActionSpriteInterface,
    /**
     * les sprites de l'action de sauter
     */
    jumping: GameEntityTrueActionSpriteInterface,
    /**
     * les sprites de l'action de attaqué
     */
    attacking: GameEntityTrueActionSpriteInterface,
    /**
     * les sprites de l'action de ne rien faire
     */
    nothing: GameEntityTrueActionSpriteInterface
}
/**
 * l'interface Actions de sprites de GameEntityTrueSpriteInterface
 */
interface GameEntityTrueActionSpriteInterface {
    /**
     * les images des sprites
     */
    sprites: GameEtityTrueActionSpritesSpriteInterface,
    /**
     * la duré de l'animation
     */
    animeTime: number
}
/**
 * l'interface des sprites de GameEntityTrueActionSpriteInterface
 */
interface GameEtityTrueActionSpritesSpriteInterface {
    /**
     * les sprites dont l'orientation est a gauche
     */
    left: Array<HTMLImageElement>,
    /**
     * les sprites dont l'orientation est a droite
     */
    right: Array<HTMLImageElement>
}
/**
 * les entités vivantes du jeu
 */
class GameEntity extends GameElement {
    /**
     * la duré maximal d'animaation
     */
    static maxAnimeTime: number = 10000;
    /**
     * l'orientation de l'entité
     */
    orientation: Orientation;
    /**
     * boolean indiquant si l'entité marche
     */
    isWalking: boolean;
    /**
     * les sprites de l'entité
     */
    sprites: GameEntityTrueSpriteInterface;
    /**7
     * l'actino que l'entité execute
     */
    action: Actions;
    /**
     * la frame ou en est arrivé l'animation
     */
    animeFrame: number = 0;
    /**
     * le nombre total de frame dans l'animation
     */
    maxAnimeFrame: number = 0;
    /**
     * le sprites actuelle de l'entité
     */
    _sprite: HTMLImageElement;
    /**
     * la date du dernier moment ou l'entité a été animé
     */
    lastAnimeFrame: Date | null = null;
    /**
     * la force de saut de l'entité
     */
    fj: number = 0;
    /**
     * boolean indiquant si l'entité est entrain de sauté
     */
    isJumping: boolean = false;
    /**
     * la gravité de lentité
     */
    gravity: number = 0;
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
    /**
     * defini l'action de l'entité et remet a zero l'animatione autre
     * @param action l'action de l'entité
     */
    setAction(action: Actions) {
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
    /**
     * fait sauté l'entité
     * @param power la puissance du saut de l'entité
     */
    jump(power: number = 50) {
        if (this.isJumping) return;
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
        let collisions: detailTouchInterface[] = [];
        for (let c of CollisionObjects) {
            collisions.push(this.touch(c, true));
        }
        let touchGround = false;
        for (let c of collisions) {
            if (c.res && c.face === Face.top) touchGround = true;
        }
        if (touchGround) this.fy = 0;

        let fff = false;
        let winnerIndex = 0;
        let _i = 0;
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
/**
 * interface de style pour les GameMovingElement
 */
interface GameMovingElemementStyleInterface<T extends "rectangle" | "sprites" | "path"> {
    /**
     *  le type de style
     */
    type: T,
    /**
     * si type est a "path" les points sur lesquels passé pour faire la figure.
     */
    points?: T extends "path" ? Array<[number, number]> : undefined,
    /**
     * si type est a "path" ou "rectangle" la couleure 
     */
    color?: T extends "path" | "rectangle" ? string | rgb : undefined,
    /**
     * si type est a "path" dis si la figure vas être rempli
     */
    fill?: T extends "path" ? boolean : undefined,
    /**
     * les chemin vers les sprites
     */
    spritesPath?: T extends "sprites" ? string[] : undefined,
    /**
     * les chemin veres le sprites de l'animation de mort
     */
    onDeathSpritesPath?: T extends "sprites" ? string[] : undefined,
    /**
     * dit si draw doit changé la taille des sprites
     */
    resiveSprites?: T extends "sprites" ? boolean : undefined,
    /**
     * la suré de l'animation
     */
    animeTime?: T extends "sprites" ? number : undefined,
    /**
     * si type est a "path" indique si draw doit montré prescisément les points
     */
    showPoints?: T extends "path" ? boolean : undefined,
    /**
     * si type est a "path" indique si la figure doit être fermer
     */
    closePath?: T extends "path" ? boolean : undefined
}
/**
 * les entité servent au attaques et autre
 */
class GameMovingElement extends GameElement {
    /**
     * le style de l'entité
     */
    movingStyle: GameMovingElemementStyleInterface<"sprites" | "rectangle" | "path">;
    /**
     * les sprites de l'entité
     */
    sprites: HTMLImageElement[] | null = null;
    /**
     * les sprites de l'animation de la mort de l'entité
     */
    deathSprites: HTMLImageElement[] | null = null;
    /**
     * la date du dernier moment ou l'entité a été animé
     */
    lastAnimeFrame: Date | null = null;
    /**
     * la frame ou en est arrivé l'animation
     */
    animeFrame: number = 0;
    /**
     * le nombre total de frame de l'animation
     */
    maxAnimeFrame: number = 0;
    /**
     * le sprite actuelle de l'animation
     */
    _sprite: HTMLImageElement = new Image();
    /**
     * bolean indiquant si l'entité est en vie
     */
    isAlive: boolean = true;
    /**
     * la duré maximal d'animaation
     */
    static maxAnimeTime: number = 10000;
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
    constructor(width: number, height: number, x: number, y: number, style: GameMovingElemementStyleInterface<"path" | "rectangle" | "sprites">, fx: number = 0, fy: number = 0, life: number = 1, showHitBox: boolean = false, hitBoxColor: rgb = rgb.random()) {
        super(width, height, x, y, life, { type: 'rectangle', color: 'black' }, fx, fy, false, showHitBox, hitBoxColor);
        this.movingStyle = style;
        if (this.movingStyle.type === 'sprites') {
            this.sprites = [];
            if (this.movingStyle.spritesPath === undefined) throw new TypeError('GameMovingElement, spritesPath must be defined if type is sprites');
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
    draw(ctx: CanvasRenderingContext2D) {
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
        } else if (this.movingStyle.type === 'path') {
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
        } else if (this.movingStyle.type === 'sprites') {
            if (this.movingStyle.resiveSprites || false) {
                ctx.drawImage(this._sprite, this.x, this.y, this.width, this.height);
            } else {
                ctx.drawImage(this._sprite, this.x, this.y);
            }
        }
    }
    /**
     * change le sprites de l'entité pour qu'ile s'anime (a utilisé en boucle)
     */
    anime() {
        if (this.movingStyle.type !== 'sprites') return;
        if (this.sprites === null) return;
        if (this.lastAnimeFrame instanceof Date) {
            let len = 1;
            if (this.isAlive) len = this.sprites.length;
            else if (this.deathSprites !== null) len = this.deathSprites.length;
            if (this.movingStyle.animeTime === undefined) this.movingStyle.animeTime = 100;
            let time: number = this.movingStyle.animeTime;
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
class _M00 extends GameEntity {
    constructor(x: number, y: number) {
        super(100, 100, x, y, 2, {
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
        });
        MonstersElement.push(this);
    }
    follow() {
        const maxFX = 10;
    }
}
const MonstersElement: GameEntity[] = []
const Monster = {
    Monsters: [
        _M00
    ],
    Monbi: _M00
}
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
    constructor(x: number, y: number, showHitBox: boolean = false, hitBoxColor: rgb = rgb.random()) {
        super(68.75, 93.75, x, y, 10, {
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
        }, 0, 0, Orientation.right, showHitBox, hitBoxColor);
    }
    /**
     * dessine le joueure
     * @param ctx - le context sur le quelle dessiner le joueure
     */
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