const express = require('express');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
class app {
    constructor() {
        this.app = express();
        this.plugins();
        this.route();
    }

    plugins() {
        this.app.use(cors());
        this.app.use(express.static('public'));
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())
        this.app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: 'velixsoverlord@xsyss',
            name: 'secretName',
            cookie: {
                sameSite: true,
                maxAge: 3600000
            },
        }));
        this.app.set('view engine', 'ejs');
        this.app.set('views', './app/views');
        this.app.use(expressLayouts);
        this.app.set('layout', './app/views/layouts/main')
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.set('Cache-Control', 'no-store');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
    }

    route() {
        this.app.use('/', require('../routes/web.js'));
    }
}

module.exports = app;