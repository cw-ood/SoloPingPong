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
    console.log("cursor x is : " + mouseObj.x + " cursor Y is : " + mouseObj.y);
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