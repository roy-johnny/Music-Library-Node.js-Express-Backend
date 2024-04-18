const express = require('express');
const router = express.Router();
const db = require('../db');
const global = require('../global');
const check = require('../func/check');
const multer = require('multer');
const { nanoid } = require('nanoid');
const func = require("../func/func");
const songFilter = function(req, file, cb) {
    if (!req.account.upload) {
        req.fileValidationError = 'no_auth';
        return cb(null, false);
    }
    if (!file.originalname.match(/\.(mp3)$/)) {
        req.fileValidationError = 'Only allow mp3 file!';
        return cb(null, false);
    }
    cb(null, true);
};
const song_path = __dirname+'/../public/song/';

const song = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, song_path);
    },

    filename: async (req, file, cb) => {
        req._id = await func.get_nanoid('song', '_id', global.song_nanoid_length);
        cb(null, req._id+'.mp3');
    }
});
const song_upload = multer({ storage: song, fileFilter: songFilter });

router.post('/', check.checkAuth, song_upload.single('file'), async (req, res, next) => {
    if(req.fileValidationError) return res.status(400).send(req.fileValidationError);
    await db.song.insertOne({
        _id: req._id,
        ext: 'mp3',
        title: req.body.title,
        song: req.body.song,
        vup: req.body.vup,
        thumbnail: req.body.thumbnail,
        date: new Date(req.body.date),
        user: req.account._id,
        timestamp: new Date(),
    })
    res.status(200).send();
});

module.exports = router;
