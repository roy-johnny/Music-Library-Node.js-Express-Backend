const express = require('express');
const router = express.Router();
const db = require('../db');
const global = require('../global');
const check = require('../func/check');
const hash = require('hash.js');

const validateName = async (name) => {
    if(!name) return false;
    const re = /^[a-z0-9]+$/i;
    if(!re.test(String(name))) return false;
    return !await db.user.findOne({name: name});
}

router.get('/check', check.getAuth, async (req, res, next) => {
    if(req.account)
        res.status(200).json({
            name: req.account.name,
            upload: req.account.upload,
        });
    else
        res.status(200).json({});
});

router.get('/out', (req, res, next) => {
    req.session.destroy();
    res.status(200).send();
});

router.post('/up', check.checkRecap, check.checkNoAuth, async (req, res, next) => {
    if(!await validateName(req.body.name)) return res.status(400).send();
    if(!req.body.pass) res.status(400).send();
    if(typeof req.body.name !== 'string') res.status(400).send();
    if(typeof req.body.pass !== 'string') res.status(400).send();
    let newdata = {
        name: req.body.name,
        pass: hash.sha256().update(req.body.name+req.body.pass).digest('hex'),
        reg_date: new Date(),
    };
    const result = await db.user.insertOne(newdata);
    if(!result) return res.status(400).send();
    res.status(200).send();
});

router.post('/in', check.checkRecap, check.checkNoAuth, async (req, res, next) => {
    const user = await db.user.findOne({
        name: req.body.name,
        pass: hash.sha256().update(req.body.name+req.body.pass).digest('hex')
    });
    if(!user) return res.status(400).send();
    req.session.user = user._id.toString();
    if(!req.body.remember)
        req.session.cookie.expires = false;
    res.status(200).send();
});

module.exports = router;
