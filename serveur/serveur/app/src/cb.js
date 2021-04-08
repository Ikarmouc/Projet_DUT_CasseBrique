// Variables pour la zone de jeu
let canvas;
let context; // stocke le contexte de rendu 2D, outil que nous utiliserons pour le plateau de jeu
let mouseX;
let mouseY;
let rightPressed = false;
let leftPressed = false;
let dx = 2;
let dy = -2;


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

    addScore(nbPoints) {
        this.score += nbPoints;
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
    drawBall() {
        if (canvas.getContext) {
            context.beginPath();
            context.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI, false);
            context.fillStyle = "black";
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = 'black';
            context.stroke();
            this.posX += this.speed;
            this.posY += this.speed;
        }
    }
    
    moveBall()
    {
        //console.log('x :',this.posX, ' y: ',this.posY)
        
        if (canvas.getContext) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI, false);
            context.fillStyle = "black";
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = 'black';
            context.stroke();
            this.posY+= dy;
            this.posX+= dx;
        }

    
    }
}

class Playground {
    paddle;
    wall = [];
    ball = new Ball(7, null, (canvas.width / 2), (canvas.height - 30), 0, 0);
    constructor() {
        this.paddle = new Paddle();
        this.paddle.drawPaddle();
        this.constructWall();
        this.ball.drawBall();
    }

    constructWall() {
        let nbBrickSpeed = 0;
        for (let row = 100; row < 225; row += 25) {
            for (let col = 12.5; col < canvas.width - ((canvas.width) / 10); col += (canvas.width) / 10 + 5) {
                let brick;
                let rand = Math.floor(Math.random() * 5) + 1;
                if (rand % 5 == 0 && nbBrickSpeed < 15) {
                    brick = new BrickSpeed(col, row);
                    nbBrickSpeed++;
                } else {
                    brick = new BrickNormal(col, row);
                }
                this.wall.push(brick);
            }
        }

    }
    
    checkCollisonBallPaddle()
    {
        // Collision avec le haut
        if(this.ball.getPosY() + dy < 3) {
            dy = -dy;
        }

        // collison sur le mur bas du canvas
        if(this.ball.getPosY() + dy > canvas.height- 3) {
            dy = -dy;
        }
        
        // Collision sur le mur gauche et droit
        if(this.ball.getPosX() + dx > canvas.width || this.ball.posX + dx < 0) {
            dx = -dx;
        }

        // Collision avec le paddle
        
        if(this.ball.posY >= this.paddle.posY-this.paddle.height)
        {
            if(this.ball.posX+this.ball.size <= this.paddle.posX+this.paddle.width && this.ball.posX+this.ball.size >= this.paddle.posX)
            {
                dy = -dy; 
            }
        }

        // collision avec les briques
        //console.log(this.wall)
        for(let i = 0; i< this.wall.length; i++)
        {
            if(this.ball.posY == this.wall[i].posY+this.wall[i].height)
            {
                if(this.ball.posX+this.ball.size <= this.wall[i].posX+this.wall[i].width && this.ball.posX + this.ball.size >= this.wall[i].posX)
                {
                    dy = -dy; 
                }
            }

            // if(this.ball.posX <= this.wall[i].posX && this.ball.posY >= this.wall[i].posY)
            // {
            //     console.log("position brique : ", this.wall[i].color , "position en x : ", this.wall[i].posX, "position en y : ", this.wall[i].posY )
            //     console.log("Position en x de la balle : ", this.ball.posX,"Position en x de la balle : ", this.ball.posY);
            //     console.log("collision !");
            //     dy =0;
            //     dx = 0;
            // }
        }

    }

    drawPlayground() {


        //================  Balle ======================
        this.playground.checkCollisonBallPaddle();

        this.playground.ball.moveBall();
        this.playground.paddle.drawPaddle();

        //================ Paddle =======================

        if (rightPressed) {
            // this.paddle ne pointe pas sur l'objet de paddle contenu dans playground
            // il faut donc passer par cette méthode
            this.playground.paddle.movePaddle(5);
            
        }
        else if (leftPressed) {
            this.playground.paddle.movePaddle(-5);
        }
        //===============================================

        //================ Bricks =======================
            this.playground.wall.forEach(brick => {
            brick.drawBrick();
            });
        //===============================================
        
    }
}

class Brick {
    color;
    points;
    speed;
    posX;
    posY;
    width;
    height;
    constructor(color, points, speed, posX, posY) {
        if (this.constructor === Brick) {
            throw new TypeError('Abstract class "Brick" cannot be instantiated directly');
        }
        this.color = color;
        this.points = points;
        this.speed = speed;
        this.posX = posX;
        this.posY = posY;
        this.width = (canvas.width) / 10;
        this.height = 20;
    }
    getPoints() {
        return this.points;
    }
    getSpeed() {
        return this.speed;
    }
    drawBrick() {
        if (canvas.getContext) {
            context.beginPath();
            context.rect(this.posX, this.posY, this.width, this.height);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    }
    getPosX()
    {
        return this.posX;
    }

    getPosY()
    {
        return this.posY;
    }
}

class BrickNormal extends Brick {
    constructor(posX, posY) {
        super("blue", 10, 0, posX, posY);
    }
    getPoints() {
        return super.getPoints();
    }
    getSpeed() {
        return super.getSpeed();
    }
    drawBrick() {
        super.drawBrick();
    }
}

class BrickSpeed extends Brick {
    constructor(posX, posY) {
        super("green", 30, 0.5, posX, posY);
    }
    getPoints() {
        return super.getPoints();
    }
    getSpeed() {
        return super.getSpeed();
    }
    drawBrick() {
        super.drawBrick();
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
        this.drawPaddle();
    }

    drawPaddle() {
        if (canvas.getContext) {
            context.beginPath();
            context.rect(this.posX, this.posY, this.width, this.height);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
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

function keyDown(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUp(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}


//--------------------------------------------
//Gestion de la récéption et envoie des scores
//--------------------------------------------
function getScore(event) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let score = JSON.parse(xhr.responseText);
            console.log(score);
            for (let i = 0; i < score.length; i++) {
                console.log(score[i]);
                let newScore = $('<p></p>');
                if (i == 0) {
                    newScore = $('<p></p>');

                }
                newScore.text(score[i].nom + " : " + score[i].score);
                $('#score-details').append(newScore);
            }
        }
    }
    xhr.open('GET', 'http://localhost:3000/bestPlayers/10', true);
    xhr.send();
}


function setScore(nom) {
    console.log("test")
    let nomGagnant = $('#inputScore').val();
    console.log(nomGagnant);
    $.post('http://localhost:3000/newScore', { nom: nomGagnant, score: scorePlayer });
}


$(document).ready(function () {
    canvas = document.getElementById('drawArea');

    context = canvas.getContext('2d');
    getScore();
    game = new Game(0, 3, null, null);

    playground = new Playground();

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    setInterval(playground.drawPlayground, 12);

    $('#score').html("score : " + game.getScore());
});