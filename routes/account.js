const express = require('express');
const router = express.Router();
const db = require('../db');
const check = require('../func/check');
const func = require('../func/func');
const hash = require('hash.js');

router.post('/pass', check.checkAuth, async (req, res, next) => {
    if(!req.body.old) res.status(400).send();
    if(!req.body.pass) res.status(400).send();
    if(typeof req.body.pass !== 'string') res.status(400).send();
    if(!await db.user.findOne({_id: req.account._id, pass: hash.sha256().update(req.account.name+req.body.old).digest('hex')})) return res.status(400).send();
    await db.user.updateOne({_id: req.account._id}, {$set: {pass: hash.sha256().update(req.account.name+req.body.pass).digest('hex')}});
    await func.signoutAllSessions(req.session.user);
    res.status(200).send();
});

module.exports = router;
