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
    vx: 4,
    vy: 8,
    
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
    ctx.fillText("Score: " + points, 20, 20);
}
paintScore();

// Step 06 .. cnw .. Place paddles (top and bottom) on canvas
function paddlePosition(TB) {
    this.w = 150;
    this.h = 5; 
    
    this.x = W/2 - this.w/2;
    
    if (TB == "top") {
        this.y = 0;
    }  else {
        this.y = H - this.h;  
        }
}

var paddlesArray = []; // Paddles Array
paddlesArray.push(new paddlePosition("top"));
paddlesArray.push(new paddlePosition("bottom"));
//console.log("top paddle y is: " + paddlesArray[0].y);
//console.log("bottom paddle y is: " + paddlesArray[1].y);

function paintPaddles() {
    for (var lp = 0; lp < paddlesArray.length; lp++) {
        p = paddlesArray[lp];
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x, p.y, p.w, p.h);
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
        p.x = mouseObj.x - p.w / 2;
        
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
        if (ball.y + ball.r > H) {
            // Game over
        } else if (ball.y < 0) {
            // Game over
        }
        // Ball hits the side of screen
        if (ball.x + ball.r > W) {
            ball.vx = -ball.vx;
            ball.x = W - ball.r;
        } else if (ball.x - ball.r < 0) {
            ball.vx = -ball.vx;
            ball.x = ball.r;
        }
    }
    
}

var paddleHit; // Which paddle was hit 0=top, 1=bottom
function collides(b, p) {
    if (b.x + b.r >= p.x && b.x - b.r <= p.x + p.w) {
        if (b.y >= (p.y - p.h) && p.y > 0) {
            paddleHit = 0;
            return true;
        } else if (b.y <= p.h && p.y === 0) {
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
    // reverse ball y velocity
    ball.vy = - ball.vy;
    // increase the score by 1
    points++;
}

