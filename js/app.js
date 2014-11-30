/**
 * Creates a GameObject.
 *
 * @constructor
 */
var GameObject = function() {
    this.x = 0;
    this.y = 0;
    this.sprite = '';
};

/**
 *  Updates the state of a game Object.
 *
 * @param {number} dt delta of the time between updates cycles.
 */
GameObject.prototype.update = function(dt) {};

/**
 * Render the object in the canvas.
 */
GameObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Creates a GameObject that can handle input key's.
 *
 * @constructor
 */
var GameObjectWithInput = function() {
    this.x = 0;
    this.y = 0;
    this.sprite = 'images/Selector.png';
};
GameObjectWithInput.prototype = Object.create(GameObject.prototype);
GameObjectWithInput.prototype.constructor = GameObjectWithInput;

/**
 * Receives a input key and call's the appropriate method if one exists.
 *
 * @param key the input key.
 */
GameObjectWithInput.prototype.handleInput = function(key) {
    if (this.constructor.prototype.hasOwnProperty(key)) {
        this[key]();
    }
};

/**
 * Creates a Enemy Bug.
 *
 * @constructor
 */
var Enemy = function() {
    this.speed = 1 + Math.random();
    this.x = 0;
    this.y = (60) + Math.round(Math.random() * 2) * 83;
    this.sprite = 'images/enemy-bug.png';
}
Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Update the enemy bug so it will be moving forward.
 *
 * @param {number} dt delta of the time between updates cycles.
 */
Enemy.prototype.update = function(dt) {
    this.x  = (this.x + (101 * dt * this.speed)) % 1010;
};

/**
 * Creates a Player.
 *
 * @param {string} image the player image.
 * @param x initial x position.
 * @param y initial y position.
 *
 * @constructor
 */
var Player = function(image, x, y) {
    this.x = x;
    this.y = y;
    this.lifes = 3;
    this.gems = [];
    this.attacks = [];
    this.sprite = image;
    this.dead = false;
};
Player.prototype = Object.create(GameObjectWithInput.prototype);
Player.prototype.constructor = Player;

/**
 * Render the player and it's stats.
 */
Player.prototype.render = function() {
    GameObject.prototype.render.apply(this);
    var gemImage = Resources.get('images/GemGreen.png');
    var heartImage = Resources.get('images/Heart.png');
    for (var i = 0; i < this.gems.length; i++) {
        ctx.drawImage(gemImage, (5) + (i * gemImage.width *.3), 35, gemImage.width *.3, gemImage.height *.3);
    }
    for (var i = 0; i < this.lifes; i++) {
        ctx.drawImage(heartImage, (5) + (i * heartImage.width *.3), 540, heartImage.width *.3, heartImage.height *.3);
    }
};

/**
 * Remove rocks that get out of the game view.
 */
Player.prototype.update = function() {
    this.attacks = this.attacks.filter(function(rock) {
        return  rock.x > 0 &&
                rock.x < 505 &&
                rock.y > 0 &&
                rock.y < 475;
    });
};

/**
 * Add a bonus to the player.
 *
 * @param {Object} bonus a Life or a Gem bonus.
 */
Player.prototype.addBonus = function(bonus) {
    if (bonus instanceof Life) {
        this.lifes++;
    } else if (bonus instanceof Gem) {
        this.gems.push(bonus);
    }
};

/**
 * Move the player up.
 */
Player.prototype.up = function() {
    this.y -= 83;
};

/**
 * Move the player down.
 */
Player.prototype.down = function() {
    var newValue = this.y + 83;
    if (newValue > 0 && newValue < 475 ) {
       this.y = newValue;
    }
};

/**
 * Move the player to left.
 */
Player.prototype.left = function() {
    var newValue = this.x  - 101;
    if (newValue > 0 && newValue < 505 ) {
        this.x = newValue;
    }
};

/**
 * Move the player to right.
 */
Player.prototype.right = function() {
    var newValue = this.x + 101;
    if (newValue > 0 && newValue < 505) {
        this.x = newValue;
    }
};

/**
 * Throw a Rock Up, if have a gem.
 */
Player.prototype.throwUp = function() {
    if (this.gems.pop() != undefined) {
        this.attacks.push(new Rock(player, 'up'));
    }
};

/**
 * Throw a Rock to the left, if have a gem.
 */
Player.prototype.throwLeft = function() {
    if (this.gems.pop() != undefined) {
        this.attacks.push(new Rock(player, 'left'));
    }
};

/**
 * Throw a Rock to the right, if have a gem.
 */
Player.prototype.throwRight = function() {
    if (this.gems.pop() != undefined) {
        this.attacks.push(new Rock(player, 'right'));
    }
};

/**
 * Reset player as dead.
 */
Player.prototype.die = function() {
    this.lifes--;
    if (this.lifes > 0) {
        this.x = 205;
        this.y = 404;
    } else {
        this.dead = true;
        this.x = -2000;
        this.y = -2000;
    }
};

/**
 * Creates a player selector, it's used to select between the chars.
 *
 * @constructor
 */
var PlayerSelector = function() {
    this.players = [
        new Player('images/char-cat-girl.png', 2, 404),
        new Player('images/char-horn-girl.png', 103, 404),
        new Player('images/char-boy.png', 205, 404),
        new Player('images/char-pink-girl.png', 306, 404),
        new Player('images/char-princess-girl.png', 407, 404),
    ];
    this.selected = false;
    this.selectorIdx = 2;
    this.x = 205;
    this.y = 404;
    this.sprite = 'images/Selector.png';
    keyUpInputHandler.handler = this;
};
PlayerSelector.prototype = Object.create(GameObjectWithInput.prototype);
PlayerSelector.prototype.constructor = PlayerSelector;

/**
 * Render the char selection.
 */
PlayerSelector.prototype.render = function() {
    GameObject.prototype.render.apply(this);
    this.players.forEach(function(p) {
        GameObject.prototype.render.apply(p);
    });
    this.x = 2 + (101 * this.selectorIdx);
    this.y = 404;
};

/**
 * Move the selected to the char at the left side.
 */
PlayerSelector.prototype.left = function() {
    if (this.selectorIdx > 0) {
        this.selectorIdx--;
    }
}

/**
 * Move the selected to the char at the right side.
 */
PlayerSelector.prototype.right = function() {
    if (this.selectorIdx < this.players.length-1) {
        this.selectorIdx = (this.selectorIdx+1) % this.players.length;
    }
};

/**
 * Selects the char and start the game.
 */
PlayerSelector.prototype.start = function() {
    player = this.players[this.selectorIdx];
    keyUpInputHandler.handler = player;
    this.selected = true;
};

/**
 * Creates a Gem at a random location.
 *
 * @constructor
 */
var Gem = function() {
    this.x = Math.round(Math.random() * 4) * 101;
    this.y = (60) + Math.round(Math.random() * 2) * 83;
    this.sprite = Gem.sprites[Math.round(Math.random() * (Gem.sprites.length-1))];
};
Gem.sprites = ['images/GemBlue.png', 'images/GemGreen.png', 'images/GemOrange.png'];

Gem.prototype = Object.create(GameObject.prototype);
Gem.prototype.constructor = Gem;

/**
 * Creates a Life at a random location.
 *
 * @constructor
 */
var Life = function() {
    this.x = Math.round(Math.random() * 4) * 101;
    this.y = (60) + Math.round(Math.random() * 2) * 83;
    this.sprite = 'images/Heart.png';
};
Life.prototype = Object.create(GameObject.prototype);
Life.prototype.constructor = Life;

/**
 * Creates a rocket.
 *
 * @param player {Object} the player object to get the initial coordinates.
 * @param direction {string} the direction that the rock will move 'up', 'left' or 'right'.
 *
 * @constructor
 */
var Rock = function(player, direction) {
    this.x = player.x;
    this.y = player.y;
    this.direction = direction;
    this.sprite = 'images/Rock.png';
};
Rock.prototype = Object.create(GameObject.prototype);
Rock.prototype.constructor = Rock;

/**
 * Updates the rock's position.
 *
 * @param {number} dt delta of the time between updates cycles.
 */
Rock.prototype.update = function(dt) {
    switch (this.direction) {
        case 'up':
            this.y  -= 83 * dt * 3;
            break;
        case 'left':
            this.x  -= 101 * dt * 3;
            break;
        case 'right':
            this.x  += 101 * dt * 3;
            break;
    }
};

/**
 * All the Enemies at the Game.
 *
 * @type {Array.<Enemy>}
 */
var allEnemies = [];

/**
 * All the Bonus at the Game.
 *
 * @type {Array.<Object>}
 */
var allBonus = [];

/**
 * Interval Id to start/stop adding Enemies and Bonus to the Game.
 * @type {number}
 */
var interval = -1;

/**
 * Call's a handler to receive the key.
 *
 * @param e {number} the key code.
 */
var keyUpInputHandler = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'throwLeft',
        68: 'throwRight',
        83: 'throwUp',
        13: 'start'
    };

    keyUpInputHandler.handler.handleInput(allowedKeys[e.keyCode]);
};

document.addEventListener('keyup', keyUpInputHandler);

/**
 * PlayerSelector to select yout char.
 *
 * @type {PlayerSelector}
 */
var playerSelector = new PlayerSelector();

/**
 * The main Player, the value is set bu the playerSelector.
 *
 * @type {Player}
 */
var player = undefined;