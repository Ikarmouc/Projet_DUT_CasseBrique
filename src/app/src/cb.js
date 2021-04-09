// Variables pour la zone de jeu
let canvas;
let context; // stocke le contexte de rendu 2D, outil que nous utiliserons pour le plateau de jeu
let mouseX;
let mouseY;
let rightPressed = false;
let leftPressed = false;
let dx = 2;
let dy = -2;
let player;

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
    setScore(unScore) {
        this.score = unScore;
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
    speed;
    constructor(size, color, posX, posY, speed) {
        this.size = size;
        this.color = color;
        this.posX = posX;
        this.posY = posY;
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
    addSpeed(uneSpeed) {
        if (uneSpeed + this.speed < 2) {
            this.speed += uneSpeed;
        }
    }
    getColor() {
        return this.color;
    }
    drawBall() {
        if (canvas.getContext) {
            context.beginPath();
            this.posX += this.speed;
            this.posY += this.speed;
            context.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI, false);
            context.fillStyle = "#595959";
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = "#595959";
            context.stroke();
        }
    }

    moveBall() {
        if (canvas.getContext) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI, false);
            context.fillStyle = "black";
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = 'black';
            context.stroke();
            this.posY += dy * this.speed;
            this.posX += dx * this.speed;
        }
    }
}

class Playground {
    paddle;
    wall = [];
    ball;

    // Creation des elements du jeu 
    constructor() {
        this.paddle = new Paddle();
        this.paddle.drawPaddle();

        this.ball = new Ball(5, null, (canvas.width / 2), (canvas.height - 30), 1);
        this.ball.drawBall();

        this.constructWall();
        this.drawWall();
    }

    // Construction du mur de briques
    constructWall() {
        let nbBrickSpeed = 0;
        for (let row = 100; row < 225; row += 25) {
            for (let col = 15; col < canvas.width - ((canvas.width) / 10); col += (canvas.width) / 10 + 5) {
                let brick;
                let rand = Math.floor(Math.random() * 5) + 1;
                if (rand % 5 == 0) {
                    brick = new BrickSpeed(col, row);
                    nbBrickSpeed++;
                } else {
                    brick = new BrickNormal(col, row);
                }
                this.wall.push(brick);
            }
        }
    }

    checkCollisonBallPaddle() {
        // Collision avec le haut
        if (this.ball.getPosY() + dy < 3) {
            dy = -dy;
        }

        // Collison sur le mur bas du canvas
        if (this.ball.getPosY() + dy > canvas.height - 3) {

            // Verification de la vie restante du joueur
            if (game.getVie() > 0) {
                alert("Vie perdue !")
                game.vie -= 1;
                this.ball = null;
                this.paddle.posX = (canvas.width - 100) / 2;
                this.paddle.posY = canvas.height - 15;
                $('#vies').html("Vies restantes : " + game.getVie());
                this.ball = new Ball(5, null, (canvas.width / 2), (canvas.height - 30), 1);
                dy = -dy;
                dx = -dx;
                rightPressed = false;
                leftPressed = false;
            }
            if (game.getVie() < 1) {
                alert("Game over");
                this.ball = null;
                game.vie = 3;
                this.ball = new Ball(5, null, (canvas.width / 2), (canvas.height - 30), 0);
                dy = -dy;
                dx = -dx;
                this.destroyWall();
                this.constructWall();
                this.drawWall();

                $("#restart").css("display", "block");
                $("#menu").css("display", "block");
            }
        }

        // Collision sur le mur gauche et droit
        if (this.ball.getPosX() + dx > canvas.width || this.ball.posX + dx < 0) {
            dx = -dx;
        }

        // Collision avec le paddle
        if (this.ball.posX + this.ball.size <= this.paddle.posX + this.paddle.width && this.ball.posX + this.ball.size >= this.paddle.posX
            && this.ball.posY + this.ball.size <= this.paddle.posY + this.paddle.height && this.ball.posY + this.ball.size >= this.paddle.posY) {
            dy = -dy;
        }

        // collision avec les briques
        if (this.ball.posY <= canvas.height / 2) {
            for (let i = 0; i < this.wall.length; i++) {
                if (this.ball.posX <= this.wall[i].posX + this.wall[i].width && this.ball.posX >= this.wall[i].posX &&
                    this.ball.posY <= this.wall[i].posY + this.wall[i].height && this.ball.posY >= this.wall[i].posY) {
                    game.score += this.wall[i].points;
                    dy = -dy;
                    $('#scoreJoueur').html("score : " + game.getScore());
                    this.ball.addSpeed(this.wall[i].speed);
                    this.wall.splice(i, 1);
                    if (this.wall.length == 0) {
                        this.constructWall();
                        this.drawWall();
                        this.ball.posX = canvas.width / 2;
                        this.ball.posY = canvas.height - 30;
                        dx = 2;
                        dy = -2;
                        this.paddle.posX = (canvas.width - 100) / 2;
                        this.paddle.posY = canvas.height - 15;
                    }
                }
            }
        }
    }

    drawWall() {
        this.wall.forEach(brick => {
            brick.drawBrick();
        });
    }

    destroyWall() {
        this.wall = [];
    }

    drawPlayground() {

        //================  Balle ======================
        this.checkCollisonBallPaddle();

        this.ball.moveBall();
        //===============================================           

        //================ Paddle =======================
        this.paddle.drawPaddle();
        if (rightPressed) {
            // this.paddle ne pointe pas sur l'objet de paddle contenu dans playground
            // il faut donc passer par cette méthode
            this.paddle.movePaddle(5);

        }
        else if (leftPressed) {
            this.paddle.movePaddle(-5);
        }
        //===============================================

        //================ Bricks =======================
        this.drawWall();
        //===============================================
    }

    drawPlaygroundFromSetInterval() {
        //================  Balle ======================
        this.playground.checkCollisonBallPaddle();
        this.playground.ball.moveBall();
        //===============================================

        //================ Paddle =======================
        this.playground.paddle.drawPaddle();
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
        this.playground.drawWall();
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
    //Fonction permettant l'affichage de la brique utilisée quand une nouvelle game est lancée ou bien quand un niveau de mur est totalement détruit
    drawBrick() {
        if (canvas.getContext) {
            context.beginPath();
            context.rect(this.posX, this.posY, this.width, this.height);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    }
    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }
}

class BrickNormal extends Brick {
    constructor(posX, posY) {
        super("#1A9988", 10, 0, posX, posY,);
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

//Class brickSpeed héritante de la classe Brick mais ayant une vitesse de 0.1 permettant une accélération de la balle
class BrickSpeed extends Brick {
    constructor(posX, posY) {
        super("#EB5600", 30, 0.1, posX, posY);
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
        this.color = "#6AA4C8";
    }

    //Fonction gérant le déplaccement du paddle
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

    //Fonction dessinant le paddle
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


// Retourne la position de la souris (pourra etre utilisé pour d'autres fonctionalités)
function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    x = (evt.clientX - rect.left) * scaleX;
    y = (evt.clientY - rect.top) * scaleY;
}

// Fonction lancer quand la touche en ASCCI 39 ou 37 sont appuyer
function keyDown(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
        leftPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
        rightPressed = false;
    }
}

// Fonction lancer quand la touche en ASCCI 39 ou 37 sont relacher
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
            let tab = $('<tbody id="bodyScore"></tbody>');
            for (let i = 0; i < score.length; i++) {
                let oneLine = $('<tr></tr>');
                let name = $('<td></td>');
                let scorePlayer = $('<td></td>');
                name.html(score[i].nom);
                scorePlayer.html(score[i].score);
                oneLine.append(name);
                oneLine.append(scorePlayer);
                tab.append(oneLine);
            }
            $('#table').append(tab);
        }
    }
    xhr.open('GET', 'http://localhost:3000/bestPlayers/10', true);
    xhr.send();
}

function updateScore() {
    let letabScore = this.document.getElementById('tab-Score');
    $('#bodyScore').remove();
    getScore();
}


function setScoreTab() {
    let unScore = parseInt(this.game.getScore());
    let nomGagnant = $('#inputName').val();
    $.post('http://localhost:3000/newScore', { nom: nomGagnant, score: unScore });
    updateScore();
    dx = 2;
    dy = -2;
}

function start() {
    $("#start").css("display", "none");
    $("#menu").css("display", "none");
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    setInterval(playground.drawPlaygroundFromSetInterval, 15);
}

function restart() {
    document.location.reload();
}

$(document).ready(function () {
    canvas = document.getElementById('drawArea');
    context = canvas.getContext('2d');

    game = new Game(0, 3, null, null);

    //Affichage du score
    getScore();

    playground = new Playground();
    playground.drawPlayground();

    $("#start").on("click", start);
    $("#restart").on("click", restart);
    $("#restart").css("display", "none");
    $('#vies').html("Vies restantes : " + game.getVie());
    $('#score').html("Votre score : " + game.getScore());

});