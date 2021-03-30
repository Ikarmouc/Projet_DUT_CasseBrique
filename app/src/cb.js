// Variables pour la zone de jeu
let canvas;
let context; // stocke le contexte de rendu 2D, outil que nous utiliserons pour le plateau de jeu
let mouseX;
let mouseY;
let paddle;
let rightPressed = false;
let leftPressed = false;

class Joueur {
    constructor(name) {
        this.name = name;
    }
}

class Game {
    score;
    vie;
    joueur;
    playground;

    constructor(score, vie, joueur, playground) {
        this.score = score;
        this.vie = vie;
        this.joueur = joueur;
        this.playground = playground;
    }
    getScore() {
        return this.score;
    }
    getVie() {
        return this.vie;
    }
    getJoueur() {
        return this.joueur;
    }
    getPlayground() {
        return this.playground;
    }

    setJoueur(joueur) {
        this.joueur = joueur;
    }

    addScore() {
        this.score++;
    }
}

class Playground {

    ball;
    wall;
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
    color;
    points;
    speed;
    posX;
    posY;
    sizeX;
    sizeY;
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
    posX;
    posY;
    width;
    height;
    color;

    constructor() {
        this.posX = (canvas.width - 100) / 2;
        this.posY = canvas.height - 15;
        this.width = 100;
        this.height = 10;
        this.color = "#8faaff";
    }

    movePaddle(moveX) {
        if (canvas.getContext) {
            context.clearRect(this.posX, this.posY, this.width, this.height);
        }
        if (this.posX + moveX < 0) {
            this.posX = 0;
        } else if (this.posX + moveX + this.width > canvas.width) {
            this.posX = canvas.width - this.width;
        } else {
            this.posX += moveX;
        }
        this.draw();
    }

    draw() {
        if (canvas.getContext) {
            context.beginPath();
            context.rect(this.posX, this.posY, this.width, this.height);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    }
}

class Ball {
    size;
    color;
    posX;
    posY;
    angle;
    speed;
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

function keyDown(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
        console.log("keyDown 39");
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
        console.log("keyDown 37");
    }
}

function keyUp(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
        console.log("keyUp 39");
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
        console.log("keyUp 37");
    }
}

function draw() {
    //================ Paddle =======================
    document.addEventListener("keydown", keyDown);
    if (rightPressed) {
        paddle.movePaddle(5);
    }
    else if (leftPressed) {
        paddle.movePaddle(-5);
        console.log("leftPressed");
    }
    document.addEventListener("keyup", keyUp);
    //===============================================
}

$(document).ready(function () {
    canvas = document.getElementById('drawArea');

    context = canvas.getContext('2d');

    game = new Game(0, 3, null, null);

    paddle = new Paddle();
    paddle.draw();

    setInterval(draw, 10);

    $('#score').html("score : " + game.getScore());
});