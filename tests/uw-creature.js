let yoff = 0;
let theta = 0;

function parseCSVData(csvData) {
    const decoder = new TextDecoder('utf-8');
    const decodedData = decoder.decode(csvData);
    const rows = decodedData.split('\r');

    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
        const entry = {};
        for (let j = 0; j < row.length; j++) {
            entry[row[j]] = row[j + 1];
            for (const key in entry) {
              if (entry[key] === undefined) {
                delete entry[key];
              }
            }
        }
        data.push(entry);
      }
    //console.log(data);
    return data;
}

function setup() {
    const canvas = createCanvas(650, 600, WEBGL);
    canvas.parent('canvas-container');
}

/** TODO: create separate function that processes the data from parseCSVData and then passes it to draw 
  * i.e. it does the whole fetch() .then({}); thing and then separates out the values.
  * draw can take these values and include them in the equations used to draw the creatures*/

function draw() { 
  // for storing the ascii values to be used later
  const dataValues = [];

  // retrieving the data from parseCSVData function
  fetch('../tests/uw-positions.csv')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => parseCSVData(arrayBuffer))
    .then(data => {    
      // access the entry object
      data.forEach(entry => {
        // access each ascii value and add it to the array
        for (const [key, value] of Object.entries(entry)) {
          dataValues.push(value);
          //console.log(value);
        }
      });
    })
    .catch(error => {
      // handle any errors that occur during the fetch or data processing
      console.error(error);
    });

    //console.log(dataValues);

    background(41, 47, 62); //vsCode colour match

    fill(128, 150, 202, 50);
    stroke(255, 50);
    strokeWeight(2);
    frameRate(60);
  
    rotateX(75);
    rotateY(40);

    // shape stuff
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