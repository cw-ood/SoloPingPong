// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return  window.cancelAnimationFrame          ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame    ||
			window.oCancelRequestAnimationFrame      ||
			window.msCancelRequestAnimationFrame     ||
		clearTimeout;
} )();

//DO NOT TOUCH CODE ABOVE

//console.log('Holla');

// Step 01 .. cnw .. Create game canvas and track mouse position
var gameCanvas = document.getElementById("canvas");
// Store HTML5 canvas tag into JS variable

var ctx = gameCanvas.getContext("2d");
// Create canvas in 2d
var W = window.innerWidth; 
var H = window.innerHeight;

var mouseObj = {};

gameCanvas.width = W;
gameCanvas.height = H;

// Step 02 ..cnw.. Clear page canvas by convering it in black
function paintCanvas() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H); 
}

paintCanvas(); 


function trackPosition(evt) {
    mouseObj.x = evt.pageX;
    mouseObj.y = evt.pageY;
//    console.log("cursor x is : " + mouseObj.x + " cursor Y is : " + mouseObj.y);
}

gameCanvas.addEventListener("mousemove", trackPosition, true);

// Step 03 .. cnw .. Place a ball on the canvas
var ball = {}; // Ball Object
ball = {
    x: 50,
    y: 50,
    r: 5,
    c: "#ffffff",
    vx: 9,
    vy: 4,
    
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
ball.draw();

// Step 04 .. cnw .. Place a start button on canvas
var startBtn = {}; // Start button object
startBtn = {
    w: 100,
    h: 50,
    x: W / 2 - 50,
    y: H / 2 - 25,
    
    draw: function() {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        
        ctx.font = "18px Arial, sans-serif"
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Start", W/2, H/2);
        
        // Display Instructions
        ctx.fillStyle = "#ffffff"
        ctx.font = "16px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Move the mouse to move the paddles. Keep the ball from hitting the left or right.", W/2, H/2 + 60);
    }
}
startBtn.draw();

// Step 05 .. cnw .. Place score and points on canvas
var points = 0; // game points
function paintScore () {
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + points, W/2, 20);
}
paintScore();

// Step 06 .. cnw .. Place paddles (top and bottom) on canvas
function paddlePosition(TB) {
    this.w = 8;
    this.h = 150;
    
    this.y = H/2 - this.h/2;
    
    if (TB == "left") {
        this.x = 0;
    }  else {
        this.x = W - this.w;  
        }
}

var paddlesArray = []; // Paddles Array
paddlesArray.push(new paddlePosition("left"));
paddlesArray.push(new paddlePosition("right"));
//console.log("top paddle y is: " + paddlesArray[0].y);
//console.log("bottom paddle y is: " + paddlesArray[1].y);

function paintPaddles() {
    for (var lp = 0; lp < paddlesArray.length; lp++) {
        u = paddlesArray[0];
        d = paddlesArray[1];
        
        ctx.fillStyle = "#fe5cb2";
        ctx.fillRect(u.x, u.y, u.w, u.h);
        ctx.fillStyle = "#52d5da";
        ctx.fillRect(d.x, d.y, d.w, d.h);
    }
}
paintPaddles();

// Step 07 .. cnw .. Detect when the user clicks on the screen
gameCanvas.addEventListener("mousedown", btnClick, true);

function btnClick(evt) {
    var mx = evt.pageX; 
    var my = evt.pageY;
    
    // User clicked on start button
    if (mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
        if (my >= startBtn.y && my <= startBtn.y + startBtn.h) {
            //   console.log ("Start button clicked");
            // Delete the start button
        startBtn = {};
            
        // Start Game animation loop
        animloop();
        }
    }
    
    if (flagGameOver == 1) {
      if (mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
        if (my >= restartBtn.y && my <= restartBtn.y + restartBtn.h) {
    // Reset my game
            points = 0;
            ball.x = 20;
            ball.y = 20;
            ball.vx = 4;
            ball.vy = 8;
            
        flagGameOver = 0;    
        // Start Game animation loop
        animloop();
        }
      }  
    }
}

// Function for running the whole game animation
var init; // Variable to initialize animation
function animloop() {
    init = requestAnimFrame(animloop);
    refreshCanvasFun();
}

// Step 08 .. cnw .. Draw everything on canvas over and over again
function refreshCanvasFun () {
    paintCanvas();
    paintPaddles();
    ball.draw();
    paintScore();
    update();
}

function update () {
    // move the paddles, track the mouse
    for (var lp = 0; lp < paddlesArray.length; lp++) {
        p = paddlesArray[lp];
        p.y = mouseObj.y - p.h / 2;
        
    }
    // move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;
    // Check for ball paddle collision
    check4collision();
}

function check4collision() {
    var pTop = paddlesArray[0];
    var pBot = paddlesArray[1];
    
    if (collides(ball, pTop)) {
        collideAction(ball, pTop);
    } else if (collides(ball, pBot)) {
        collideAction(ball, pBot);
    } else {
        // collide with walls, or end game
        if (ball.x + ball.r > W) {
            // Game over
            gameOver();
        } else if (ball.x < 0) {
            // Game over
            gameOver();
        }
        // Ball hits the side of screen
        if (ball.y + ball.r > H) {
            ball.vy = -ball.vy;
            ball.y = H - ball.r;
        } else if (ball.y - ball.r < 0) {
            ball.vy = -ball.vy;
            ball.y = ball.r;
        }
    }
    // SPARKLES
    if(flagCollision == 1) {
        for(var k = 0; k < particleCount; k++) {
            particles.push(new createParticles(particlePos.x, particlePos.y, particleDir))
        }
    }
    // Emit particles/sparks
    emitParticles();
    // reset flagCollision
    flagCollision = 0;
}

function createParticles(x, y, d) {
    this.x = x || 0; 
    this.y = y || 0;
    this.radius = 2;
    this.vx = -1.5 + Math.random()*3;
    this.vy = d * Math.random()*1.5;
}

function emitParticles() {
    for(var j = 0; j < particles.length; j++) {
        par = particles[j];
        
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        if (par.radius > 0) {
            ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false); 
        }
        ctx.fill();
        
        par.x += par.vx;
        par.y += par.vy;
        
        // Reduce rad of particle so that is "dies after a few second
        par.radius = Math.max(par.radius - 0.05, 0.0);
    }
}

var paddleHit; // Which paddle was hit 0=top, 1=bottom
function collides(b, p) {
    if (b.y + b.r >= p.y && b.y - b.r <= p.y + p.h) {
        if (b.x >= (p.x - p.w) && p.x > 0) {
            paddleHit = 0;
            return true;
        } else if (b.x <= p.w && p.x === 0) {
            paddleHit = 1;
            return true;
        } else {
            return false;
        }
    }
}

var collisionSnd = document.getElementById("collide")

function collideAction (b, p) {
//    console.log ("sound and then bounce");
    if (collisionSnd) {
          collisionSnd.play();  
    }
    // reverse ball x velocity
    ball.vx = - ball.vx;
    
    if(paddleHit == 0) {  
        // ball hit top paddle
        ball.x = p.x - p.w;
        particlePos.x = ball.x + ball.r;
        particleDir = -1;
    } else if (paddleHit == 1) {
        // ball hit bottom paddle
         ball.x = p.w + ball.r; 
        particlePos.x = ball.x - ball.r;
        particleDir = 1;
    }
    // increase the score by 1
    points++;
    
    increaseSpd();
    
    // SPARKLES
    particlePos.y = ball.y;
    flagCollision = 1;
    
    paddleHeight();
}

// SPARKLES
var flagCollision = 0;
var particles = []; // array for particles
var particlePos = {}; // Object to contain the position of collision
var particleDir = 1; // var to control the direction of sparks
var particleCount = 20; // number of sparks when the ball hits the paddle

// 


function increaseSpd() {
    // increase ball speed after every 4 points, cant go faster than 14 pixels per second
    if (points % 4 === 0) {
        if(Math.abs(ball.vy) < 15) {
        ball.vx += (ball.vx < 0) ? -1 : 1;
        ball.vy += (ball.vy < 0) ? -2 : 2;
        }
    }
}
function paddleHeight() {
    // decrease paddle height by 5 pixels every 4 points
     if (points % 4 === 0) {
         for (var len = 0; len < paddlesArray.length; len++) {
             g = paddlesArray[len];
             g.h = g.h - 5;
         }
     }
}

var flagGameOver = 0; 
// Function to run when the game is over
function gameOver() {
//    console.log("game is over");
    // Clear the canvas

    // Display final score
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over - You scored " + points + " points!", W/2, H/2 + 25);
    // Stop the animation
    cancelRequestAnimFrame(init);
    
    // Display replay button
    restartBtn.draw();
    
    // Set the game over flag
    flagGameOver = 1;
}

var restartBtn = {}; // Start button object
restartBtn = {
    w: 100,
    h: 50,
    x: W / 2 - 50,
    y: H / 2 - 50,
    
    draw: function() {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        
        ctx.font = "18px Arial, sans-serif"
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Replay?", W/2, H/2 - 25);
    }
}