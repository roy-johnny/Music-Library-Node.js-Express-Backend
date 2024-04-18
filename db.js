const express = require('express');
const router = express.Router();
const global = require("./global");

router.transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
};
const { MongoClient } = require('mongodb');
const url = 'mongodb://' + global.db_host + ':27017';
const client = new MongoClient(url);
async function run() {
    try {
        await client.connect();
        router.session = client.startSession();
        const db = client.db(global.db_name);
        router.sessions = db.collection('sessions');
        router.song = db.collection('song');
        router.user = db.collection('user');
        router.playlist = db.collection('playlist');
    } finally {
    }
}
run().catch(console.dir);

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addMinutes = function(minutes) {
    let date = new Date(this.valueOf());
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

Date.prototype.addHours = function(minutes) {
    let date = new Date(this.valueOf());
    date.setHours(date.getHours() + minutes);
    return date;
}

Date.prototype.addSeconds = function (seconds) {
    return new Date(this.getTime() + seconds * 1000);
}

router.get_duration_string = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    if(seconds<10)
        return minutes+':0'+seconds;
    else
        return minutes+':'+seconds;
}

router.getObjectId = (id) => {
    return new require('mongodb').ObjectID(id);
}
module.exports = router;
