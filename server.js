const express = require("express");
const { getImages, addImage } = require("./db");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { upload } = require("./s3");
const { DataBrew } = require("aws-sdk");
const { s3Url } = require("./config");
const { nextTick } = require("process");

app.use(express.static("./public"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

// limit on the file size!
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.post("/upload", uploader.single("file"), upload, (req, res) => {
    const { username, title, description } = req.body;
    addImage(s3Url + req.file.filename, username, title, description)
        .then((data) => {
            console.log("successful db entry");
            res.json({
                url: s3Url + req.file.filename,
                username: username,
                title: title,
                description: description,
            });
        })
        .catch((err) => {
            console.log("error in db entry", err);
        });
    // then
    // with the data, push it into the images array at the beginning (UNSHIFT)
});

app.get("/board", (req, res) => {
    console.log("hit the board route");

    getImages()
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.log(err);
        });

    // res.json means we are no longer using res.render
    // res.render is used for rendering templates, in a SPA Vue is the boss.
    // the server is just getting stuff from the database and sending it back to Vue.
});

app.listen(8080, () => console.log("listening on 8080..."));
