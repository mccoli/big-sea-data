var canvas;
let yoff = 0;
let theta = 0;

function setup() {
    canvas = createCanvas(650, 600, WEBGL);
    canvas.position(700, 177);
}

function draw() {
    background(41, 47, 62); //vsCode colour match

    fill(128, 150, 202, 50);
    stroke(255, 50);
    strokeWeight(2);
    frameRate(60);
  
    rotateX(75);
    rotateY(40);
  
    var da = PI / 200;
    var dx = 0.07;
  
    var xoff = 0;
    
    beginShape();
  
      for (var a = 0; a <= TWO_PI; a += da) {
          
        var n = noise(xoff, yoff);
        var r = exp(cos(theta)) - 2 * cos(4 * theta) + sin(theta / 12) * map(n, 0, 1, 50, 400);
        var x = r * cos(theta + a);
        var y = r * sin(theta + a);
        var z = (sin(a * 10) * 80 + cos(a * 20));

        if (a < PI) {
          xoff += dx;
        } else {
          xoff -= dx;
        }
        vertex(x, y, z);
      } 
  
    endShape();
  
    yoff += 0.1;
    theta += 0.02;
}