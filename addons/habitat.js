var canvas;

// BPC values
let yoff = 0;
let theta = 0;

// lorenz initial points
var x = 0.1;
var y = 10;
var z = 10;
// and common constants
const o = 10;
const p = 28;
const b = 8.0/3.0

// tinkerbell paramters,
var aT = 0.9;
var bT = -0.6013;
var cT = 2.0;
var dT = 0.5;
// initial values,
var xT = -0.7;
var yT = -0.6;
var zT = 0.1;
// iterative values,
var xnext = 0;
var ynext = 0;
var znext = 0;
// and position values
var prevx = 0;
var prevy = 0;
var prevz = 0;

// arrays for vectors
var lorenzPoints = [];
var tinkerPoints = [];

// custom vector object
function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function setup() {
    canvas = createCanvas(window.innerWidth - 100, window.innerHeight - 100, WEBGL);
    canvas.parent("container");
    console.log("habitat is set up.")
}

// ! to deal with lag, call separate creature functions within draw at a lower FPS
function draw() {
    background(41, 47, 62); // vsCode colour match

    // DRAWING BPC
    fill(128, 150, 202, 50);
    stroke(255, 50);
    strokeWeight(2);
  
    rotateX(75);
    rotateY(40);
  
    var da = PI / 200;
    var dxC = 0.07;
  
    var xoff = 0;
    
    push();
    beginShape();

    translate(400, -200);  
  
      for (var a = 0; a <= TWO_PI; a += da) {
          
        var n = noise(xoff, yoff);
        var r = exp(cos(theta)) - 2 * cos(4 * theta) + sin(theta / 12) * map(n, 0, 1, 50, 400);
        let xC = r * cos(theta + a);
        let yC = r * sin(theta + a);
        let zC = (sin(a * 10) * 80 + cos(a * 20));

        if (a < PI) {
          xoff += dxC;
        } else {
          xoff -= dxC;
        }
        vertex(xC, yC, zC);
      } 
  
    endShape();
    pop();
    
    // !todo check edges 
    if (yoff > window.innerHeight) {
        yoff -= 0.1;
    } else {
        yoff += 0.1;
    }    
    theta += 0.02;

    // DRAWING LORENZ
    // timestep
    let dt = 0.01;

    // lorenz equation
    let dxL = (o * (y - x)) * dt;
    let dyL = (x * (p - z) - y) * dt;
    let dzL = (x * y - b * z) * dt;
    x = x + dxL * n;
    y = y + dyL;
    z = z + dzL;
    
    var vector = new Vector(x, y, z);
    lorenzPoints.push(vector)

    push();
    beginShape();
    
    scale(10);
    translate(yoff - 10, xoff);
    
    for (var i = 0; i < lorenzPoints.length; i++) {
        stroke(255, 50);
        vertex(lorenzPoints[i].x, lorenzPoints[i].y, lorenzPoints[i].z);
    }

    endShape();
    pop(); 

    // DRAWING TINKERBELL
    push();
    beginShape();

    scale(100);
    translate(30, 10);
    //noFill();
    strokeWeight(1);
    
    // tinkerbell fractal equation
    xnext = xT*xT - yT*yT + aT*xT + bT*yT;
    ynext = 2*xT*yT + cT*xT + dT*yT;
    // making it 3D
    znext = noise(frameRate()) + xnext*ynext;

    xT = xnext;
    yT = ynext;
    zT = znext;

    prevx = xT;
    prevy = yT;
    prevz = zT;

    var vectorT = new Vector(xT, yT, zT);
    tinkerPoints.push(vectorT);
    circle(xT, yT, zT);

    for (var i = 0; i < tinkerPoints.length; i++) {
        circle(tinkerPoints[i].xT, tinkerPoints[i].yT, tinkerPoints[i].zT);
    }
    endShape();
    pop();

    // MAKE LIL ALTERNATES OF ABOVE SHAPES
    // ? objects or separate functions so they're self contained?
}