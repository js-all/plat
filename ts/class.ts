//interface pour les style des elements
interface GameElemementStyleInterface {
    type: string,
    points?: Array<[number, number]>,
    color?: string | rgb,
    fill?: boolean,
    IMGPath?: string,
    resiveIMG?: boolean,
    showPoints?: boolean,
    closePath?: boolean
}

/**
 * @class - les elements du jeu
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
    style: GameElemementStyleInterface;

    constructor(width: number, height: number, x: number, y: number, life: number, style: GameElemementStyleInterface, fx: number = 0, fy: number = 0, onDamage: Function = function () { }, onDeath: Function = function () { }) {
        //definition des proprierter et verrification de type et de valeur si besoin
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.life = life;
        this.maxLife = life;
        this.style = style;
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
    touch(gameElement: GameElemement): boolean {
        let X: boolean = false;
        let Y: boolean = false;
        if (gameElement.x <= this.width + this.x && gameElement.x >= this.x) X = true;
        if (gameElement.y <= this.height + this.y && gameElement.y + gameElement.height >= this.y) Y = true;
        return X && Y;
    }
}
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
    constructor(width: number, height: number, x: number, y: number, life: number, style: GameElemementStyleInterface, sprites: GameEntitySpriteInterface, fx: number = 0, fy: number = 0, orientation: Orientation = Orientation.right, onDamage: Function = function () { }, onDeath: Function = function () { }) {
        super(width, height, x, y, life, style, fx, fy, onDamage, onDeath);
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
        let walkingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.walking.animeTime)
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
        let jumpingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.jumping.animeTime)
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
        let attackingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.attacking.animeTime)
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
        let nothingSpritesTime = Math.round(GameEntity.maxAnimeTime / sprites.nothing.animeTime)
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
    }
    move() {
        this.x += this.fx;
        this.y += this.fy;

    }
    anime() {

    }
}

