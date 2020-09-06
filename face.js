module.exports = (function (input) {

    return new Promise(async (resolve, reject) => {

        var fs = require("fs");
        var faceapi = require("face-api.js");
        var canvas = require("canvas");
        var { Canvas, Image, ImageData } = canvas;

        faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
        await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
        await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");

        var con = fs.readFileSync(input);
        var IMG = new Image();
        IMG.src = "data:image/jpeg;base64," + con.toString("base64");

        let faces_results = await faceapi.detectAllFaces(IMG).withFaceLandmarks();

        if(faces_results.length < 1){
            return reject();
        };

        console.log(faces_results.length);

        let drawn = canvas.createCanvas(IMG.width, IMG.height);
        let ctx = drawn.getContext("2d");

        ctx.globalAlpha = 100;
        ctx.drawImage(IMG, 0, 0, IMG.width, IMG.height);

        faces_results.forEach(function (r) {

            ctx.globalAlpha = 1;

            ctx.drawLine = function (a, b, c, d, e) {
                ctx.beginPath();
                ctx.strokeStyle = e;
                ctx.moveTo(a, b);
                ctx.lineTo(c, d);
                ctx.stroke();
            };
            ctx.drawCircle = function (a, b, c, d) {
                ctx.strokeStyle = d;
                ctx.beginPath();
                ctx.arc(a, b, c, 0, 2 * Math.PI);
                ctx.stroke();
            };
            ctx.fillCircle = function (a, b, c, d) {
                ctx.fillStyle = d;
                ctx.arc(a, b, c, 0, 2 * Math.PI);
                ctx.fill();
            };

            ctx.fillStyle = "#000000";
            ctx.fillRect(r.detection.box.x - 80, r.detection.box.y - 80, r.detection.box.width + 160, r.detection.box.height + 160);

        });

        resolve(drawn.toBuffer("image/png"));

    });

});