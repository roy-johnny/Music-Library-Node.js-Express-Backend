let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();

const bodyParser = require('body-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const global = require("./global");

const dbPort = 27017;
const dbURL = 'mongodb://' + global.db_host + ':' + dbPort + '/' + global.db_name;
const sessionMiddleware = session({
    secret: '',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dbURL
    }),
    maxAge: 7 * 86400 * 1000,
    cookie: {
        domain: '',
        maxAge: 7 * 86400 * 1000,
    }
});
app.use(sessionMiddleware);
app.sessionMiddleware = sessionMiddleware;

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use('/vsapi/v1/sign', require('./routes/sign'));
app.use('/vsapi/v1/upload', require('./routes/upload'));
app.use('/vsapi/v1/playlist', require('./routes/playlist'));
app.use('/vsapi/v1/account', require('./routes/account'));
app.use('/vsapi/v1/', require('./routes/api'));
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(function (err, req, res, next) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('404')
    }
});

module.exports = app;
