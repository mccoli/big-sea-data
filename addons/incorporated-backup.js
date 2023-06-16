const locationData = [{"lon": [-64.408957, -64.404684, -123.109629, -105.063408, -124.802441, -125.235357, -130.430602, -123.317793, -129.24614, -53.121252, -128.657131, -123.340367, -123.5521]}, 
                      {"lat": [45.367205, 45.369396, 49.300929, 69.11312, 49.153884, 50.020756, 54.258766, 49.042634, 53.422165, 47.42604, 53.974483, 49.080987, 48.6531]}, 
                      {"depth": [25.0, 2.431176, 33.980769, 8.371053, 109.235294, 8.348, 27.576471, 171.2, 93.411765, 83.076923, 47.127778, 145.0, 6.0]}
                    ]; 
var canvas;
var bpc;
var tinkerbell;
var lorenz;

//TODO use ascii codes for colour changing
// TODO add depth and darkness to the environment with noise

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

function getLocation(locationData) {
      var lonValues = locationData[0].lon;
      var latValues = locationData[1].lat;
      var depthValues = locationData[2].depth;
      
      return {
        lonValues: lonValues,
        latValues: latValues,
        depthValues: depthValues
      };
}

// collecting location data for use by creatures
const loc = getLocation(locationData)
const lonValues = loc.lonValues
const latValues = loc.latValues
const depthValues = loc.depthValues

// restart when the sketch gets laggy
var timer = 0;

function setup() {
    frameRate(30);

    canvas = createCanvas(window.innerWidth - 100, window.innerHeight - 100, WEBGL);
    canvas.parent("container");
    console.log("optimised-habitat is set up.")

    // creating instances of each creature
    bpc = new BPC(latValues[Math.floor(random() * latValues.length)], lonValues[Math.floor(random() * lonValues.length)] / 5);
    bpc0 = new BPC(latValues[Math.floor(random() * latValues.length)] * 30, lonValues[Math.floor(random() * lonValues.length)]);
    
    lorenz = new Lorenz();
    lorenz0 = new Lorenz();
    lorenz1 = new Lorenz();

    tinkerbell = new Tinkerbell();
    tinkerbell0 = new Tinkerbell();
    tinkerbell1 = new Tinkerbell();

    // console.log("longitudes:", lonValues)
    // console.log("latitudes:", latValues)
    // console.log("depths:", depthValues)
}

function draw() {
    //TODO mouse hover function for each creature with current location and description
    background(31, 40, 74); 
    rotateX(75);
    rotateY(40);

    // deep sea jelly
    bpc.update();
    bpc.display();
    bpc0.update();
    bpc0.display();

    // man of war
    lorenz.update(latValues[Math.floor(random() * latValues.length)] / 100, latValues[Math.floor(random() * latValues.length)] / 100);
    lorenz.display();
    lorenz0.update(lonValues[Math.floor(random() * lonValues.length)] / 100, depthValues[Math.floor(random() * depthValues.length)] / 1000);
    lorenz0.display();

    // bubble thang or sth that blows bubbles
    tinkerbell.update();
    tinkerbell.display();

    push();
    translate(1982, 72);
        tinkerbell0.update();
        tinkerbell0.display();
    pop();

    push();
    translate(-700, -300);
        tinkerbell1.update();
        tinkerbell1.display();
    pop();

    timer += 1;
    // 2 mins 10 secs at 30 FPS
    if (timer == 3930) {
        console.log("habitat refreshed.")
        timer = 0;
        setup();
    }
}