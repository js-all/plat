"use strict";
/*
 * js-all tout droits non resérvé
 */
/**
 * js-all 2018 tout droits non reservé
 *
 */
var rgb = /** @class */ (function () {
    /**
     *  @class
     *  @constructor
     *  @param {Number} [red] - La valeur de rouge dans la couleur. Si non préciser prend la valeur defini dans rgb.config.defaultColor.red.
     *  @param {Number} [green] - La valeur de vert dans la couleur. Si non préciser prend la valeur defini dans rgb.config.defaultColor.green.
     *  @param {Number} [blue] - La valeur de bleu dans la couleur. Si non préciser prend la valeur defini dans rgb.config.defaultColor.blue.
     *  @param {Number} [alpha] - La tansparance de la couleur, valeur entre 0 et 1. Si non préciser prend la valeur defini dans rgb.config.defaultAlpha.
     */
    function rgb(red, green, blue, alpha) {
        if (red === void 0) { red = rgb.config.defaultColor.red; }
        if (green === void 0) { green = rgb.config.defaultColor.green; }
        if (blue === void 0) { blue = rgb.config.defaultColor.blue; }
        if (alpha === void 0) { alpha = rgb.config.defaultAlpha; }
        if (typeof red !== 'number' || typeof green !== 'number' || typeof blue !== 'number')
            throw new TypeError("rgb, constructor: all params type must be number");
        this.red = red;
        this.green = green;
        this.blue = blue;
        if (typeof alpha === 'number') {
            if (alpha >= 0 && alpha <= 1) {
                this.alpha = alpha;
            }
            else {
                throw new Error("rgb, constructor: alpha params value must be betwin 0 and 1 (0 and 1 include)");
            }
        }
        else {
            throw new TypeError("rgb, constructor: type of param alha must be number");
        }
    }
    /**
     * donne une couleur aleatoire
     * @param {Boolean} [alpha = false] - dis si l'alpha va etre aussi generé aleatoirement
     * @returns {rgb}
     */
    rgb.random = function (alpha) {
        if (alpha === void 0) { alpha = false; }
        var c = new rgb();
        c.red = Math.floor(Math.random() * ((255 - 0) + 1) + 0);
        c.green = Math.floor(Math.random() * ((255 - 0) + 1) + 0);
        c.blue = Math.floor(Math.random() * ((255 - 0) + 1) + 0);
        if (alpha) {
            c.alpha = Math.floor(Math.random() * ((100 - 0) + 1) + 0) / 100;
        }
        return c;
    };
    ;
    Object.defineProperty(rgb, "red", {
        /**
         * donne une couleur rouge
         * @returns {rgb}
         */
        get: function () {
            return new rgb(255, 0, 0);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(rgb, "green", {
        /**
         * donne une couleur verte
         * @returns {rgb}
         */
        get: function () {
            return new rgb(0, 255, 0);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(rgb, "blue", {
        /**
         * donne une couleur bleu
         * @returns {rgb}
         */
        get: function () {
            return new rgb(0, 0, 255);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(rgb, "black", {
        /**
         * donne une couleur noire
         * @returns {rgb}
         */
        get: function () {
            return new rgb(0, 0, 0);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(rgb, "white", {
        /**
         * donne une couleur blanche
         * @returns {rgb}
         */
        get: function () {
            return new rgb(255, 255, 255);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(rgb, "grey", {
        /**
         * donne une couleur grise
         * @returns {rgb}
         */
        get: function () {
            return rgb.createGrey(122.5);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * crée un gris
     * @param {Number} [g = 122.5] le niveau de gris, de 0 à 255 (0: noir, 255: blanc)
     */
    rgb.createGrey = function (g) {
        if (g === void 0) { g = 122.5; }
        return new rgb(g, g, g);
    };
    ;
    /**
     * renvoi une copie d'une couleure
     * @param {rgb} color la couleur à copier
     * @param {Boolean} [alpha = true] dis si la fonction va copié l'alpha
     */
    rgb.copy = function (color, alpha) {
        if (alpha === void 0) { alpha = true; }
        var res = new rgb(color.red, color.green, color.blue);
        if (alpha) {
            res.alpha = color.alpha;
        }
        return res;
    };
    ;
    rgb._$$loc = function (c) {
        return "color:" + c + ";";
    };
    rgb._$$bloc = function (c) {
        return "background-color: " + rgb.config.codeLogColor.bg + ";color: " + c + ";";
    };
    rgb.help = function () {
        var helps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            helps[_i] = arguments[_i];
        }
        for (var i = 0; i < helps.length; i++) {
            var help = helps[i].toLowerCase();
            var code = rgb.config.codeLogColor;
            if (help === 'rgb.config') {
                console.info('%cthe config of rgb class for set his default color and other things.', rgb._$$loc(code.info));
            }
            else if (help === 'rgb.config.warn') {
                console.info('%cdefault value: %ctrue%c\nactive or unactive rgb warn.', rgb._$$loc(code.info), rgb._$$loc(code.boolean), rgb._$$loc(code.info));
            }
            else if (help === 'rgb.config.overwritecolor') {
                console.info('%cdefault value: %ctrue%c\n' +
                    'say if methodes will overwrite the color when they are called.\n' +
                    'ex:\n' +
                    '%c const %cmyColor %c= %cnew %crgb%c.%cblack%c(); \n' +
                    '%c myColor%c.%cbrighter%c().%clogColor%c();   \n' +
                    '%c myColor%c.%clogColor%c();              %c\n' +
                    '\n' +
                    'if it is true the two loged color will be the same' +
                    ' but if it is false, the first color will be myColor but brighter of 20 and the second will be just myColor.', rgb._$$loc(code.info), rgb._$$loc(code.boolean), rgb._$$loc(code.info), rgb._$$bloc(code.new) + 'border-top-left-radius:5px;', rgb._$$bloc(code.class), rgb._$$bloc(code.operator), rgb._$$bloc(code.new), rgb._$$bloc(code.class), rgb._$$bloc(code.white), rgb._$$bloc(code.class), rgb._$$bloc(code.white) + 'border-top-right-radius:5px;', rgb._$$bloc(code.red), rgb._$$bloc(code.white), rgb._$$bloc(code.methode), rgb._$$bloc(code.white), rgb._$$bloc(code.methode), rgb._$$bloc(code.white), rgb._$$bloc(code.red) + 'border-bottom-left-radius:5px;', rgb._$$bloc(code.white), rgb._$$bloc(code.methode), rgb._$$bloc(code.white) + 'border-bottom-right-radius:5px;', rgb._$$loc(code.info));
            }
            else if (help === 'rgb.config.defaultalpha') {
            }
            else if (help === 'rgb.config.codelogcolor') {
            }
            else {
                console.info("%chelp, not found or not writed.", rgb._$$loc(code.info));
            }
        }
    };
    /**
     * renvoi la couleur sou forme de string. exemple: new rgb(0, 255, 0, 1).kl renvoi "rgba(0, 255, 0, 1)"
     * @param {boolean} [alpha = true] - precise si la transparence de la couleure doir etre donne. example new rgb(0, 255, 0, 1).get() renvoie "rgba(0, 255, 0, 1)" alors que new rgb(0, 255, 0, 1).get(false) renvoie "rgb(0, 255, 0)", si non preciser prend true.
     */
    rgb.prototype.get = function (alpha) {
        if (alpha === void 0) { alpha = true; }
        if (typeof alpha != 'boolean')
            throw new TypeError("rgb, get: alpha type must be a boolean");
        var res = "(" + this.red + ", " + this.green + ", " + this.blue;
        if (alpha) {
            res = 'rgba' + res + ' ,' + this.alpha + ')';
        }
        else {
            res = 'rgb' + res + ')';
        }
        return res;
    };
    Object.defineProperty(rgb.prototype, "value", {
        get: function () {
            var alpha = this.alpha == 1 ? false : true;
            if (typeof alpha != 'boolean')
                throw new TypeError("rgb, get: alpha type must be a boolean");
            var red = this.red > 255 ? 255 : this.red < 0 ? 0 : this.red;
            var green = this.green > 255 ? 255 : this.green < 0 ? 0 : this.green;
            var blue = this.blue > 255 ? 255 : this.blue < 0 ? 0 : this.blue;
            var res = "(" + red + ", " + green + ", " + blue;
            var Alpha = this.alpha > 1 ? 1 : this.alpha < 0 ? 0 : this.alpha;
            if (alpha) {
                res = 'rgba' + res + ' ,' + Alpha + ')';
            }
            else {
                res = 'rgb' + res + ')';
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Augmente la luminositer de la couleur.
     * @param {Number} [bright = 20] - la valeur de l'eclairssicement.
     */
    rgb.prototype.brighter = function (bright) {
        if (bright === void 0) { bright = 20; }
        if (typeof bright != 'number')
            throw new TypeError("rgb, brighter: bright params type must be a number");
        var res = rgb.config.overwriteColor ? this : rgb.copy(this);
        res.red += bright;
        res.green += bright;
        res.blue += bright;
        return res;
    };
    /** Baisse la luminositer de la couleur.
      * @param {Number} [dark = 20] - la valeur de l'assombricement. Si non preciser prend 20.
      */
    rgb.prototype.darker = function (dark) {
        if (dark === void 0) { dark = 20; }
        if (typeof dark != 'number')
            throw new TypeError("rgb, darker: dark params type must be a number");
        var res = rgb.config.overwriteColor ? this : rgb.copy(this);
        res.red -= dark;
        res.green -= dark;
        res.blue -= dark;
        return res;
    };
    Object.defineProperty(rgb.prototype, "hex", {
        /**
         * La meme chose que value mais renvoi de l'hexadecimal.
         */
        get: function () {
            var alpha = false;
            var red = this.red < 255 ? this.red < 0 ? 0 : this.red : 255;
            var green = this.green < 255 ? this.green < 0 ? 0 : this.green : 255;
            var blue = this.blue < 255 ? this.blue < 0 ? 0 : this.blue : 255;
            var sred = red.toString(16);
            var sgreen = green.toString(16);
            var sblue = blue.toString(16);
            var Sred = sred.length === 2 ? sred : '0' + sred;
            var Sgreen = sgreen.length === 2 ? sgreen : '0' + sgreen;
            var Sblue = sblue.length === 2 ? sblue : '0' + sblue;
            var res = "#" + Sred + Sgreen + Sblue;
            if (alpha) {
                res += (255 * ((Math.round(this.alpha) * 100) / 100)).toString(16);
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * inverse la couleur
     */
    rgb.prototype.invert = function () {
        var res = rgb.config.overwriteColor ? this : rgb.copy(this);
        res.red = 255 - res.red;
        res.green = 255 - res.green;
        res.blue = 255 - res.blue;
        return res;
    };
    /**  affiche la couleure dans la console.
      *  @param {any} [log] - text à afficher en dessous de la couleure.
      *  @param {any[]} [logParam] - parametre du text a afficher comme dans console.log().
      */
    rgb.prototype.logColor = function (log) {
        var logParam = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            logParam[_i - 1] = arguments[_i];
        }
        var strr = log === undefined ? "" : "\n" + log;
        var br = 10;
        var unit = 'px';
        var op = "color: " + this.value + ";background-color: " + this.value + ";";
        var opp = op + 'border-top-left-radius:' + br + unit + ';border-top-right-radius:' + br + unit + ';';
        var oppp = op + 'border-bottom-left-radius:' + br + unit + ';border-bottom-right-radius:' + br + unit + ';';
        console.log.apply(console, ['%c      \n' +
                '%c      \n' +
                '%c      %c' +
                strr,
            opp, op, oppp, ''].concat(logParam));
        return this;
    };
    /**
     * permet de rajouter des couleure a rgb ex: rgb.red
     * @param {String} name - le nom de la nouvelle couleur a rajouter
     * @param {rgb} color - la couleure qui serat retourner par l'appel de ce nouveau getter
     */
    rgb.addColorGetter = function (name, color) {
        if (color === void 0) { color = new rgb(); }
        if (name === undefined)
            throw new Error('rgb, addColorClass: name arg is required');
        if (typeof name !== 'string')
            throw new TypeError('rgb, addColorClass: name arg must be a string');
        Object.defineProperty(rgb, name, {
            get: function () {
                return new rgb(color.red, color.green, color.blue, color.alpha);
            }
        });
    };
    /**
     * pars de la couleure actuelle pour aller vers une aurte couleure passer en paramatre
     * @param {rgb} color - la couleure vers la quelle on veut aller
     * @param {Number} [percent = 50] - le pourcentage de la transformation vers la couleure
     */
    rgb.prototype.to = function (color, percent) {
        if (percent === void 0) { percent = 50; }
        if (color === undefined)
            throw new Error('rgb, to: color arg is required');
        if (typeof percent !== 'number')
            throw new TypeError('rgb, to: percent arg must be a number between 0 and 100 (0 and 100 include)');
        if (percent > 100 || percent < 0)
            throw new Error('rgb, to: percent arg must be between 0 and 100 (0 and 100 include)');
        var res = rgb.config.overwriteColor ? this : rgb.copy(this);
        var toRed = color.red - res.red;
        var toGreen = color.green - res.green;
        var toBlue = color.blue - res.blue;
        var toAlpha = color.alpha - res.alpha;
        var red = toRed * (percent / 100);
        var green = toGreen * (percent / 100);
        var blue = toBlue * (percent / 100);
        var alpha = toAlpha * (percent / 100);
        res.red += red;
        res.green += green;
        res.blue += blue;
        res.alpha += alpha;
        return res;
    };
    /**
     * equivalent a rgb.copy: clone une couleur.
     * @param {Boolean} [alpha = true] - boolean disant si la fonction doit aussi copié l'aplha de la couleure
     */
    rgb.prototype.clone = function (alpha) {
        if (alpha === void 0) { alpha = true; }
        return rgb.copy(this, alpha);
    };
    rgb.config = {
        warn: true,
        defaultColor: {
            red: 0,
            green: 0,
            blue: 0
        },
        overwriteColor: true,
        defaultAlpha: 1,
        codeLogColor: {
            new: 'rgb(198, 120, 221)',
            white: 'rgb(255, 255, 255)',
            bg: 'rgb(40, 44, 52)',
            red: 'rgb(255, 80, 80)',
            class: 'rgb(229, 192, 107)',
            boolean: 'rgb(237, 151, 101)',
            info: 'rgb(0,0,0)',
            operator: 'rgb(84, 82, 194)',
            methode: 'rgb(97, 175, 233)'
        }
    };
    return rgb;
}());
