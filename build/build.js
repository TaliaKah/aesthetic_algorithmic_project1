var gui = new dat.GUI();
var params = {
    curvesnumber: 10,
    numberplot: 5,
    numberpts: 8,
    translateblackx: 15,
    translateblacky: 15,
    translateblue: 10,
    translatecurves: 2,
    Download_Image: function () { return save(); },
};
gui.add(params, "curvesnumber", 0, 30, 1);
gui.add(params, "numberplot", 1, 30, 1);
gui.add(params, "translateblackx", -30, 30, 1);
gui.add(params, "translateblacky", -30, 30, 1);
gui.add(params, "translateblue", -30, 30, 1);
gui.add(params, "translatecurves", -30, 30, 1);
gui.add(params, "Download_Image");
function pt(x, y) {
    return { x: x, y: y };
}
function translatept(p, dec) {
    if (random(1) > 0.5)
        return { x: p.x + dec, y: p.y + dec };
    else
        return p;
}
function translateptx(p, dec) {
    return { x: p.x + dec, y: p.y + dec };
}
function tofilllist(n) {
    var l = [];
    for (var i = 0; i < n; i++) {
        var p = pt(0, 0);
        l = append(l, p);
    }
    return l;
}
function plotcurves(p1, p2, p3, p4) {
    curve(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
}
function forbidden(p, pe) {
    var test = false;
    if ((p.x > width) || (p.x < 0)) {
        test = true;
    }
    if ((p.y > height) || (p.y < 0)) {
        test = true;
    }
    if ((((p.x > width / 2) && (p.y > height / 2) && (p.x < pe.x) && (p.y < pe.y))
        || ((p.x < width / 2) && (p.y > height / 2) && (p.x > pe.x) && (p.y < pe.y))
        || ((p.x > width / 2) && (p.y < height / 2) && (p.x < pe.x) && (p.y > pe.y))
        || ((p.x < width / 2) && (p.y < height / 2) && (p.x > pe.x) && (p.y > pe.y)))) {
        test = true;
    }
    return test;
}
function draw() {
    randomSeed(0);
    background("white");
    var listep = [];
    var pc = pt(width / 2, height / 2);
    var a = pc.x - width / 20;
    var b = pc.y - height / 20;
    var ai = pc.x - width / 10;
    var bi = pc.x - width / 10;
    var pe;
    var ind = 0;
    noFill();
    for (var z = 0; z < 2 * PI; z = z + 2 * PI / params.numberplot) {
        listep = append(listep, [tofilllist(params.numberpts + 2)]);
        pe = pt(pc.x + ai * cos(z), pc.y + bi * sin(z));
        listep[ind][0] = pt(pc.x + noise(pc.x + a * cos(z), pc.y + b * sin(z)) * a * cos(z), pc.y + noise(pc.x + a * cos(z), pc.y + b * sin(z)) * b * sin(z));
        listep[ind][params.numberpts + 1] = pt(pc.x + params.translateblue + noise(pc.x + params.translateblue + a * cos(z), pc.y + b * sin(z)) * a * cos(z), pc.y + noise(pc.x + a * cos(z), pc.y + b * sin(z)) * b * sin(z));
        for (var j = 1; j < params.numberpts + 1; j++) {
            var p = pt(randomGaussian(listep[ind][j - 1].x, params.translateblackx), randomGaussian(listep[ind][params.numberpts + 1].y, params.translateblacky));
            while (forbidden(p, pe)) {
                p = pt(randomGaussian(listep[ind][j - 1].x, params.translateblackx), randomGaussian(listep[ind][params.numberpts + 1].y, params.translateblacky));
            }
            listep[ind][j] = pt(randomGaussian(listep[ind][j - 1].x, params.translateblackx), randomGaussian(listep[ind][params.numberpts + 1].y, params.translateblacky));
        }
        for (var i = 0; i < params.curvesnumber; i++) {
            stroke(0, 0, 255, 20);
            plotcurves(listep[ind][params.numberpts + 1], translateptx(listep[ind][1], params.translateblue), translateptx(listep[ind][2], params.translateblue), translateptx(listep[ind][3], params.translateblue));
            plotcurves(translateptx(listep[ind][1], params.translateblue), translateptx(listep[ind][2], params.translateblue), translateptx(listep[ind][3], params.translateblue), translateptx(listep[ind][4], params.translateblue));
            plotcurves(translateptx(listep[ind][2], params.translateblue), translateptx(listep[ind][3], params.translateblue), translateptx(listep[ind][4], params.translateblue), translateptx(listep[ind][5], params.translateblue));
            plotcurves(translateptx(listep[ind][3], params.translateblue), translateptx(listep[ind][4], params.translateblue), translateptx(listep[ind][5], params.translateblue), translateptx(listep[ind][6], params.translateblue));
            plotcurves(translateptx(listep[ind][4], params.translateblue), translateptx(listep[ind][5], params.translateblue), translateptx(listep[ind][6], params.translateblue), translateptx(listep[ind][7], params.translateblue));
            plotcurves(translateptx(listep[ind][5], params.translateblue), translateptx(listep[ind][6], params.translateblue), translateptx(listep[ind][7], params.translateblue), translateptx(listep[ind][8], params.translateblue));
            plotcurves(translateptx(listep[ind][6], params.translateblue), translateptx(listep[ind][7], params.translateblue), translateptx(listep[ind][8], params.translateblue), listep[ind][params.numberpts + 1]);
            plotcurves(translateptx(listep[ind][7], params.translateblue), translateptx(listep[ind][8], params.translateblue), listep[ind][params.numberpts + 1], translateptx(listep[ind][1], params.translateblue));
            plotcurves(translateptx(listep[ind][8], params.translateblue), listep[ind][params.numberpts + 1], translateptx(listep[ind][1], params.translateblue), translateptx(listep[ind][2], params.translateblue));
            stroke(0, 0, 0, 50);
            plotcurves(listep[ind][0], listep[ind][1], listep[ind][2], listep[ind][3]);
            plotcurves(listep[ind][1], listep[ind][2], listep[ind][3], listep[ind][4]);
            plotcurves(listep[ind][2], listep[ind][3], listep[ind][4], listep[ind][5]);
            plotcurves(listep[ind][3], listep[ind][4], listep[ind][5], listep[ind][6]);
            plotcurves(listep[ind][4], listep[ind][5], listep[ind][6], listep[ind][7]);
            plotcurves(listep[ind][5], listep[ind][6], listep[ind][7], listep[ind][8]);
            plotcurves(listep[ind][6], listep[ind][7], listep[ind][8], listep[ind][0]);
            plotcurves(listep[ind][7], listep[ind][8], listep[ind][2], listep[ind][1]);
            plotcurves(listep[ind][8], listep[ind][0], listep[ind][1], listep[ind][2]);
            for (var s = 0; s < params.numberpts + 2; s++) {
                listep[ind][s] = translatept(listep[ind][s], params.translatecurves);
            }
        }
        ind++;
    }
}
function setup() {
    p6_CreateCanvas();
}
function windowResiinded() {
    p6_ResizeCanvas();
}
var __ASPECT_RATIO = 1;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map