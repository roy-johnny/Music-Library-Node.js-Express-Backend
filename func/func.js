const express = require('express');
const router = express.Router();
const db = require('../db');
const {nanoid} = require("nanoid");

router.get_nanoid = async (db_name, field, nanoid_length) => {
    let output = nanoid(nanoid_length), query = {};
    query[field] = output;
    while(await db[db_name].findOne(query)) {
        output = nanoid(nanoid_length);
        query[field] = output;
    }
    return output;
};

router.signoutAllSessions = (user_id) => {
    var filter = {'session':{'$regex': '.*"user":"'+user_id+'".*'}};
    db.sessions.deleteMany(filter);
};

module.exports = router;