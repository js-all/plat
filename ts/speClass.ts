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
    constructor(x: number, y: number, showHitBox: boolean = false, hitBoxColor: string = "red") {
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
            ctx.fillStyle = this.hitBoxColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        let y = 1;
        ctx.drawImage(pathToImage(this.style.IMGPath || ''), 5, y, 22, 32 - (y), this.x, this.y, this.width, this.height)
    }
}

Monster.addMonster(class extends GameEntity {
    constructor() {
        super(100, 100, 0, 0, 2, {
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
                ],
                animeTime: 1000
            }
        });

    }
    follow() {
        const maxFX = 10;
    }
})