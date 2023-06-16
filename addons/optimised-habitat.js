var canvas;
var bpc;
var tinkerbell;
var lorenz;

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class BPC {
    // x, y refers to location within canvas
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.da = PI / 200;
        this.dx = 0.07;
        this.xoff = 0;
        this.yoff = 0;
        this.theta = 0;
    }

    // methods
    update() {
        this.xoff += this.dx;
        this.yoff += 0.1;
        this.theta += 0.02;
    }

    display() {
        fill(128, 150, 202, 50);
        stroke(255, 50);
        strokeWeight(2);

        push();
        beginShape();

        translate(this.x, this.y + this.yoff);

        for (var a = 0; a <= TWO_PI; a += this.da) {
            var n = noise(this.xoff, this.yoff);
            var r = exp(cos(this.theta)) - 2 * cos(4 * this.theta) + sin(this.theta / 12) * map(n, 0, 1, 50, 400);
            let x = r * cos(this.theta + a);
            let y = r * sin(this.theta + a);
            let z = sin(a * 10) * 80 + cos(a * 20);
      
            if (a < PI) {
              this.xoff += this.dx;
            } else {
              this.xoff -= this.dx;
            }
            vertex(x, y, z);
        }

        endShape();
        pop();
    }
}

class Tinkerbell {
    constructor() {
        // empty array for vectors
        this.points = [];
        // parameters
        this.a = 0.9;
        this.b = -0.6013;
        this.c = 2.0;
        this.d = 0.5;
        // initial values
        this.x = -0.7;
        this.y = -0.6;
        this.z = 0.1;
        // iterative values
        this.xnext = 0;
        this.ynext = 0;
        this.znext = 0;
        // position values
        this.prevx = 0;
        this.prevy = 0;
        this.prevz = 0;
    }

    // methods
    update() {
        this.xnext = this.x * this.x - this.y * this.y + this.a * this.x + this.b * this.y;
        this.ynext = 2 * this.x * this.y + this.c * this.x + this.d * this.y;
        this.znext = noise(frameRate()) + this.xnext * this.ynext;

        this.prevx = this.x;
        this.prevy = this.y;
        this.prevz = this.z;

        this.x = this.xnext;
        this.y = this.ynext;
        this.z = this.znext;
    }

    display() {
        push();
        translate(300, 200);
        beginShape();
        
        scale(100);
        //noFill();
        fill(128, 150, 202, 50);
        strokeWeight(1);
        stroke(255, 50);

        var vector = new Vector(this.x, this.y, this.z);
        this.points.push(vector);
        circle(this.x, this.y, this.z);

        // for (var i = 0; i < this.points.length; i++) {
        //     circle(this.points[i].x, this.points[i].y, this.points[i].z);
        // }
        endShape();
        pop();
    }
}

class Lorenz {
    constructor() {
        this.xoff = 0;
        this.yoff = 0;
        // initial points
        this.x = 0.1;
        this.y = 10;
        this.z = 10;
        // common constants from wikipedia
        this.o = 10;
        this.p = 28;
        this.b = 8.0/3.0;
        // timestep
        this.dt = 0.01;
        // array for holding vectors
        this.points = [];
    }

    update(xAmount, yAmount) {
        let dx = (this.o * (this.y - this.x)) * this.dt;
        let dy = (this.x * (this.p - this.z) - this.y) * this.dt;
        let dz = (this.x * this.y - this.b * this.z) * this.dt;
        
        this.x += dx;
        this.y += dy;
        this.z += dz;

        this.xoff += xAmount;
        this.yoff += yAmount;
    }

    display() {
        var vector = new Vector(this.x, this.y, this.z);
        this.points.push(vector);

        push();
        translate(-100 + this.xoff, -100 + this.yoff);
        beginShape();
        scale(5);

        for (var i = 0; i < this.points.length; i++) {
            vertex(this.points[i].x, this.points[i].y, this.points[i].z);
        }

        endShape();
        pop();
    }
}

function setup() {
    canvas = createCanvas(window.innerWidth - 100, window.innerHeight - 100, WEBGL);
    canvas.parent("container");
    console.log("optimised-habitat is set up.")

    // creating instances of each creature
    bpc = new BPC(400, -200);
    lorenz = new Lorenz();
    tinkerbell = new Tinkerbell();
}

function draw() {
    background(31, 40, 74); 
    rotateX(75);
    rotateY(40);

    bpc.update();
    bpc.display();

    lorenz.update(0.1, 0.1);
    lorenz.display();

    tinkerbell.update();
    tinkerbell.display();
}