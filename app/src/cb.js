// Variables pour la zone de jeu
let canvas;
let context; // stocke le contexte de rendu 2D, outil que nous utiliserons pour le plateau de jeu
let mouseX;
let mouseY;
let paddle;
class Joueur {
    constructor(name) {
        this.name = name;
    }
}

class Game {
    constructor(score, vie, joueur, playground) {
        this.score = score;
        this.vie = vie;
        this.joueur = joueur;
        this.playground = playground;
    }
}

class Playground {
    constructor(ball) {
        this.wall = [];
        this.ball = ball;
    }

    addBrick(uneBrique) {
        this.wall.push(uneBrique);
    }

    constructWall() {
        //Construction du mur de manière automatique
    }

}

class Brick {
    constructor(color, points, speed, posX, posY, sizeX, sizeY) {
        if (this.constructor === Brick) {
            throw new TypeError('Abstract class "Brick" cannot be instantiated directly');
        }
        this.color = color;
        this.points = points;
        this.speed = speed;
        this.posX = posX;
        this.posX = posY;
        this.sizeX = 50;
        this.sizeY = 30;

    }
    getPoints() {
        return this.points;
    }
    getSpeed() {
        return this.speed;
    }
    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }
}

class brickNormal extends Brick {
    constructor(posX, posY) {
        super("blue", 10, 0, posX, posY);
    }
}

class BrickSpeed extends Brick {
    constructor(posX, posY) {
        super("red", 30, 0.5, posX, posY);
    }
}

class Paddle {
    constructor() {
        this.posX = (canvas.width - 100) / 2;
        this.posY = canvas.height - 15;
        this.width = 100;
        this.height = 10;
        this.color = "#8faaff";
    }

    getSize() {
        return this.size;
    }

    getcolor() {
        return this.color;
    }

    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    movePaddle(newPos) {
        this.posX = newPos;
    }

    draw() {
        if ($("#drawArea").getContext) {
            context.beginPath();
            context.rect(this.posX, this.posY, this.width, this.height);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    }

}

class Ball {
    constructor(size, color, posX, posY, angle, speed) {
        this.size = size;
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.angle = angle;
        this.speed = speed;
    }
    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }
    getSpeed() {
        return this.speed;
    }
    addSpeed(amount) {
        this.speed += amount;
    }
    getAngle() {
        return this.angle;
    }
    getColor() {
        return this.color;
    }

}

class Edge {

}

class Bouncy extends Edge {

}

class Void extends Edge {

}


function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    x = (evt.clientX - rect.left) * scaleX;
    y = (evt.clientY - rect.top) * scaleY;
}


function draw() {
    if ($("#drawArea").getContext) {
        ctx.beginPath();
        ctx.rect($("#drawArea").width / 2, $("#drawArea").heith - 15, 40, 10);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
}

$(document).ready(function () {

    context = $("#drawArea").getContext('2d');

    $paddle = new Paddle();
    $paddle.draw();

    /* Canvas */
    //draw()
});