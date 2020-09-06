let fs = require("fs");
let face = require("./face");
let imageToAscii = require("image-to-ascii");
var NodeWebcam = require("node-webcam");

var opts = {
    width: 1280,
    height: 720,
    quality: 100,
    frames: 1,
    delay: 0,
    saveShots: false,
    output: "jpeg",
    device: false,
    callbackReturn: "buffer",
    verbose: false
};

let express = require("express");
let app = express();

app.get("*", function (req, res) {
    NodeWebcam.capture("test_picture", opts, function (err, _data) {
        face("./test_picture.jpg").then(function (data) {
            imageToAscii(data, {
                bg: false
            }, (err, converted) => {
                if (err) {
                    console.log(err);
                    res.end("An error occured!" + "\n");
                } else {
                    res.end(converted + "\n");
                };
            });
        }).catch(e => {
            console.log("Not enough faces!");
            res.end("An error occured!" + "\n");
        });
    });
});

app.listen(4004);