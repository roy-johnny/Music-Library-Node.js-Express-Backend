const express = require('express');
const router = express.Router();
const db = require('../db');
const global = require('../global');
const path = require("path");
const check = require("../func/check");
const func = require("../func/func");

router.get('/', check.checkAuth, async (req, res, next) => {
    const playlist = await db.playlist.find({user: req.account._id}).toArray();
    res.status(200).json( {
        playlist: playlist,
    });
});

router.post('/new', check.checkAuth, async (req, res, next) => {
    if(!req.body.name) return res.status(400).send();
    if(typeof req.body.name !== 'string') return res.status(400).send();
    const id = await func.get_nanoid('playlist', '_id', global.playlist_nanoid_length);
    await db.playlist.insertOne({
        _id: id,
        name: req.body.name,
        user: req.account._id,
        playlist: [],
        num: 0,
        timestamp: new Date(),
    })
    res.status(200).json({id: id});
});

router.post('/rename', check.checkAuth, async (req, res, next) => {
    if(!req.body.name) return res.status(400).send();
    if(typeof req.body.name !== 'string') return res.status(400).send();
    await db.playlist.updateOne({_id: req.body.id, user: req.account._id}, {$set: {
        name: req.body.name,
        timestamp: new Date(),
    }});
    res.status(200).send();
});

const isStringsArray = arr => arr.every(i => typeof i === "string")

router.post('/update', check.checkAuth, async (req, res, next) => {
    if(!Array.isArray(req.body.playlist)) return res.status(400).send();
    if(!isStringsArray(req.body.playlist)) return res.status(400).send();
    if(req.body.id) {
        let playlist = await db.playlist.findOne({_id: req.body.id, user: req.account._id});
        if(!playlist) return res.status(400).send();
        if(playlist.playlist !== req.body.playlist)
            await db.playlist.updateOne({_id: req.body.id}, {$set: {
                playlist: req.body.playlist,
                num: req.body.playlist.length,
                timestamp: new Date(),
            }});
        return res.status(200).send();
    }
    if(req.body.name) {
        if(typeof req.body.name === 'string') {
            const id = await func.get_nanoid('playlist', '_id', global.playlist_nanoid_length);
            await db.playlist.insertOne({
                _id: id,
                name: req.body.name,
                user: req.account._id,
                playlist: req.body.playlist,
                num: req.body.playlist.length,
                timestamp: new Date(),
            });
            return res.status(200).json({id: id});
        }
    }
    res.status(400).send();
});

router.delete('/:ID', check.checkAuth, async (req, res, next) => {
    const id = req.params.ID;
    await db.playlist.deleteOne({_id: id, user: req.account._id});
    res.status(200).send();
});

router.get('/:ID', check.checkAuth, async (req, res, next) => {
    const id = req.params.ID;
    const pl = await db.playlist.findOne({_id: id, user: req.account._id});
    if(!pl) return res.status(404).send();
    const playlist = await db.playlist.aggregate([
        {$match: {_id: id, user: req.account._id}},
        {$project: {_id: 0, playlist: 1}},
        {
            $unwind:{
                path: '$playlist',
            }
        },
        {
            $lookup: {
                from: 'song',
                localField: 'playlist',
                foreignField: '_id',
                as: 'playlist'
            }
        },
        {
            $unwind:{
                path: '$playlist',
            }
        },
        {
            $set: {
                _id: '$playlist._id',
                name: { $concat: [ '$playlist.title', ' ', {$dateToString: {format: "%Y-%m-%d", date: {$add: ["$playlist.date", 8*60*60*1000]}}} ]},
                singer: '$playlist.vup',
                cover: { $concat: [ global.site_url, '/disk/', '$playlist.thumbnail' ]},
                musicSrc: { $concat: [ global.site_url, '/song/', '$playlist._id', '.', '$playlist.ext' ]},
            }
        },
        {$project: {playlist: 0}},
    ]).toArray();
    res.status(200).json( {
        pl: pl.playlist,
        playlist: playlist,
    });
});

module.exports = router;
