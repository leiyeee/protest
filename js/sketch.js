var displayword = "BLACK LIVES MATTER",
    density = 0.2,
    fractalization = 0.005,
    falloff = 0.5,
    speed = 0.5,
    seed,
    font,
    table,
    points = [],
    startingPoints;

function preload() {
    font = loadFont("https://leiyeee.github.io/protest/font/LEMONMILK-Bold.otf");
};

function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent("p5");

    textFont(font);
    textSize(100);

    fill(255);

    noiseDetail(10, falloff);
    randomSeed(seed);
    noiseSeed(seed);

    startingPoints = font.textToPoints(displayword, width / 2 - textWidth(displayword) / 2, height / 2 + 40, 100, {
        "sampleFactor": density
    });

    points = [];

    for (let p = 0; p < startingPoints.length; p++) {
        points[p] = startingPoints[p];
        points[p].zOffset = random();
    };

}

function draw() {

    background(0, 0, 0, 10);
    stroke(100);
    strokeWeight(1);

    if (pmouseX !== mouseX || mouseY !== mouseY) {
        stroke(255);
        strokeWeight(2);
        background(0, 0, 0, 50);

        for (let i = 0; i < 5; i++) {
            let angle = random(TAU);
            let magnitude = randomGaussian() * ((5 - 1) ** 0.5 * 3);
            let newPoint = {
                "x": mouseX + magnitude * cos(angle),
                "y": mouseY + magnitude * sin(angle),
                "zOffset": random()
            };
            points[points.length] = newPoint;
            startingPoints[startingPoints.length] = newPoint;
        };

    }

    for (let pt = 0; pt < points.length; pt++) {
        let p = points[pt];
        let noiseX = p.x * fractalization;
        let noiseY = p.y * fractalization;
        let newPX = p.x + map(noise(noiseX, noiseY, 0), 0, 1, -speed, speed);
        let newPY = p.y + map(noise(noiseX, noiseY, 255), 0, 1, -speed, speed);
        line(p.x, p.y, newPX, newPY);
        p.x = newPX;
        p.y = newPY;
    }

    //
    //    if (frameCount % 60 == 0) {
    //        for (let i = 0; i < 5; i++) {
    //            let angle = random(TAU);
    //            let magnitude = randomGaussian() * ((5 - 1) ** 0.5 * 3);
    //            let newPoint = {
    //                "x": mouseX + magnitude * cos(angle),
    //                "y": mouseY + magnitude * sin(angle),
    //                "zOffset": random()
    //            };
    //            points[points.length] = newPoint;
    //            startingPoints[startingPoints.length] = newPoint;
    //        };
    //    };


}
