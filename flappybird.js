//board
let board;
let boardWidth = window.screen.width;
let boardHeight = window.screen.height;
let context;

//bird
let birdWidth = 80;
let birdHeight = 50;
let birdX = boardWidth / 3 ;
let birdY = boardHeight / 10 ;
let birdImg;
let birdImgDie;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 70;
let pipeHeight = 560;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//calculation
let velocityX = -4;
let velocityY = 0;
let gravity = 0.3;
let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load images
    birdImg = new Image();
    birdImg.src = "./Flappy_bird.png";

    birdImgDie = new Image();
    birdImgDie.src = "./unnamed.png";

    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 2024 );
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", movebirdbytouchstart);
    
}

function showHighScorePage() {
    window.location.href = "Highscore.html";
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        board.style.opacity = 1;

        if (score > localStorage.getItem('highScore')) {
            localStorage.setItem('highScore', score);
        }
        
        if (score > localStorage.getItem('score')) {
            localStorage.setItem('score', score);
        }
        
        setTimeout(function () {
            window.location.href = "Highscore.html";
            showHighScorePage();

        }, 10);

        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;

        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 30,  60);

    if (gameOver) {
        
        context.fillText("GAME OVER", 30, 250);
        context.drawImage(birdImgDie, bird.x, bird.y, bird.width, bird.height);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;
    
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        //jump
        velocityY = -8;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
function movebirdbytouchstart(e){
    e.preventDefault();
    velocityY = -8.3;

    //reset game
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        gameOver = false;
    }
}

