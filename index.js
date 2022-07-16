let canvas = document.getElementById('pongCanvas');  // Create a canvas element
let ctx = canvas.getContext('2d'); //context of the canvas

const fps = 30; 

let init_xVelocity = 10;
let init_yVelocity = 4;
let leftScore=0; 
let rightScore=0;

let winningScore = 5; 
let winner = false; 

let ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    xVelocity: init_xVelocity,
    yVelocity: init_yVelocity,
    color: 'white'
}

let leftPaddle = {
    x: 0,
    y: canvas.height/2,
    width: 10,
    height: 100,
    yVelocity:0,
    color: 'white'
}

let rightPaddle = {
    x: canvas.width-10,
    y: canvas.height/2,
    width: 10,
    height: 100,
    yVelocity:0,
    color: 'white'
}


const calculateMousePosition = (event) => {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;
    return {x: mouseX, y: mouseY};
}

const resetBall = () => {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.xVelocity = ball.xVelocity>0 ? -init_xVelocity : init_xVelocity;
    ball.yVelocity = ball.yVelocity>0 ? -init_yVelocity : init_yVelocity;
    
}

const moveComputerPaddle = () => {
    if(ball.x + ball.radius > canvas.width/2) {
        if(ball.y + ball.radius > rightPaddle.y + rightPaddle.height/2 - 0.4*rightPaddle.height) {
            rightPaddle.yVelocity = 5;
        }
        else if(ball.y - ball.radius < rightPaddle.y + rightPaddle.height/2 + 0.4*rightPaddle.height) {
            rightPaddle.yVelocity = -5;
        }
        else {
            rightPaddle.yVelocity = 0;
        }
    }
    else {
        rightPaddle.yVelocity = 0;
    }
    rightPaddle.y += rightPaddle.yVelocity;
}


const moveElements = () => {
    moveComputerPaddle();

    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;

    //bouncing at horizontal walls
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.yVelocity *= -1;
    }
    
    //bouncing at left paddle/ resetting if it hits vertical walls
    if(ball.x - ball.radius < leftPaddle.width || ball.x + ball.radius > canvas.width - rightPaddle.width) {
        //bouncing from left paddle
        if(ball.y + ball.radius > leftPaddle.y && ball.y - ball.radius < leftPaddle.y + leftPaddle.height) {
            ball.xVelocity *= -1;
            // we will increase the vall velocity on the basis of how close it was to the edge of the paddle 
            ball.yVelocity += (ball.y - (leftPaddle.y + leftPaddle.height/2)) * 0.3;
        } 
        //bouncing from right paddle
        else if(ball.y + ball.radius > rightPaddle.y && ball.y - ball.radius < rightPaddle.y + rightPaddle.height) {
            ball.xVelocity *= -1;
            ball.yVelocity += (ball.y - (rightPaddle.y + rightPaddle.height/2)) * 0.3;
        }
        else {
            // find which player's score Increased
            if(ball.x + ball.radius > canvas.width/2) {
                leftScore++;
            }
            else {
                rightScore++;
            }
            if(leftScore === winningScore || rightScore === winningScore) {
                winner = true;
            }
            resetBall();
        }
    }
}

const drawWinnerBoard = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(leftScore===winningScore ? 'Player Wins!' : 'Computer Wins!', canvas.width/2, canvas.height/2);
    ctx.font = '30px monospace';
    ctx.fillText('Click anywhere to play again.', canvas.width/2, canvas.height/2+50);
}

const drawBoard = () => {
    //drawing the background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height); // Draw a rectangle
    // 4 parameters: distance of rect from left, distance of rect from top, width of rect, height of rect

    ctx.fillStyle = 'white';
    ctx.font = '50px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Pong.', canvas.width/2, canvas.height/2);

    if(winner) {
        drawWinnerBoard();
    }

    else{
    //drawing the balls
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, true);
    // 5 parameters: x and y of centre, radius, start angle, end angle, anticlockwise
    ctx.fill();

    //drawing the paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    //displaying the scores
    ctx.fillStyle = 'white';
    ctx.font = '25px monospace';
    ctx.fillText(leftScore.toString(), canvas.width/2 - 350, 50);
    ctx.fillText(rightScore.toString(), canvas.width/2 + 350, 50);
    }
}


window.onload = function() {
    setInterval(function() {
        drawBoard();
        moveElements();
    }, 1000/fps);

    //mouse click listener
    canvas.addEventListener('mousedown', function(event) {
        if(winner) {

            winner = false;
            leftScore = 0;
            rightScore = 0;
            resetBall();
            return;
        }
        else return;
    }
    );

    // cursor move listener
    canvas.addEventListener('mousemove', function(event) {
        let mousePosition = calculateMousePosition(event);
        leftPaddle.y = mousePosition.y-leftPaddle.height/2;
    }
    );
}
