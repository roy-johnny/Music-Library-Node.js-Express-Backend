const express = require('express');
const router = express.Router();
const db = require('../db');
const global = require('../global');
const axios = require("axios");

router.checkRecap = async (req, res, next) => {
    const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify?secret='+global.recap_secret_key+'&response='+req.body.token
    );
    if(response.data.success)
        next();
    else
        res.status(400).send();
};

router.getAuth = async (req, res, next) => {
    if (req.session.user) {
        req.account = await db.user.findOne({_id: db.getObjectId(req.session.user)});
        if(!req.account) {
            req.session.destroy();
            return res.status(403).send();
        }
        db.user.updateOne({_id: req.account._id}, {$set: {last_date: new Date()}});
    }
    next();
};

router.checkAuth = async (req, res, next) => {
    if (req.session.user) {
        req.account = await db.user.findOne({_id: db.getObjectId(req.session.user)});
        if(!req.account) {
            req.session.destroy();
            return res.status(403).send();
        }
        next();
    } else {
        res.status(403).send();
    }
};

router.checkNoAuth = (req, res, next) => {
    if (req.session.user) {
        res.status(403).send();
    } else {
        next();
    }
};

module.exports = router;