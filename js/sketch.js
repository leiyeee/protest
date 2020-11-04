var displayword = "BLACK LIFE MATTERS";
const showText = false; 
const textAlpha = 0.1; //the alpha of the text if displayed (low value will make it slowly fade in)
const backgroundColor = 0; //kinda self-explanatory
const strokeAlpha = 70; //the alpha of the lines (lower numbers are more transparent)
const strokeColor = 254; //the line color


const fontSampleFactor = 0.4; //How many points there are: the higher the number, the closer together they are (more detail)

const noiseZoom = 0.006; //how zoomed in the perlin noise is
const noiseOctaves = 4; //The number of octaves for the noise
const noiseFalloff = 0.5; //The falloff for the noise layers

const zOffsetChange = 0; //How much the noise field changes in the z direction each frame
const individualZOffset = 0; //how far away the points/lines are from each other in the z noise axies (the bigger the number, the more chaotic)

const lineSpeed = 0.6; //the maximum amount each point can move each frame

const newPointsCount = 9; //the number of new points added when the mouse is dragged

var seed;
var font;
var points = [];
var startingPoints;

function preload() {
    font = loadFont("../assets/LEMONMILK-Bold.OTF");
};

function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent("p5");

    background(backgroundColor);
    textFont(font);
    textSize(100);
    fill(strokeColor, textAlpha);
    stroke(strokeColor, strokeAlpha);
    noiseDetail(noiseOctaves, noiseFalloff);

    start();
};

function start() {
    background(backgroundColor);
    randomSeed(seed);
    noiseSeed(seed);
    frameCount = 0;
    startingPoints = font.textToPoints(displayword, width / 2 - textWidth(displayword) / 2, height / 2 + 40, 100, {
        "sampleFactor": fontSampleFactor
    });

    points = [];
    for (let p = 0; p < startingPoints.length; p++) {
        points[p] = startingPoints[p];
        points[p].zOffset = random();
    }
}

function draw() {
    background(0, 0, 0, 10);
    
    if (showText) {
        noStroke();
        text(displayword, width / 2 - textWidth(displayword) / 2, height / 2);
        stroke(strokeColor, strokeAlpha);
    }
    for (let pt = 0; pt < points.length; pt++) {
        let p = points[pt];
        let noiseX = p.x * noiseZoom;
        let noiseY = p.y * noiseZoom;
        let noiseZ = frameCount * zOffsetChange + p.zOffset * individualZOffset;
        let newPX = p.x + map(noise(noiseX, noiseY, noiseZ), 0, 1, -lineSpeed, lineSpeed);
        let newPY = p.y + map(noise(noiseX, noiseY, noiseZ + 214), 0, 1, -lineSpeed, lineSpeed);
        line(p.x, p.y, newPX, newPY);
        p.x = newPX;
        p.y = newPY;
    }
}

function keyPressed() {
    if (keyIsDown(CONTROL) && key.toLowerCase() === 's') {
        save();
    } else if (keyCode === BACKSPACE || keyCode === DELETE) {
        displayword = displayword.subdisplayword(0, displayword.length - 1);
        start();
    } else if (keyCode === RETURN) {
        seed = floor(random(1000000));
        start();
    } else if (keyCode === 32 || keyCode >= 186 || (keyCode >= 48 && keyCode <= 90)) {
        displayword += key;
        start();
    }
}

function mouseDragged() {
    for (let i = 0; i < newPointsCount; i++) {
        let angle = random(TAU);
        let magnitude = randomGaussian() * ((newPointsCount - 1) ** 0.5 * 3);
        let newPoint = {
            "x": mouseX + magnitude * cos(angle),
            "y": mouseY + magnitude * sin(angle),
            "zOffset": random()
        };
        points[points.length] = newPoint;
        startingPoints[startingPoints.length] = newPoint;
    }
}
