require("dotenv").config();
const app = require('./app/config/app.js');
const { Server } = require('socket.io');
const url = require('url');
const logger = require('./app/utils/Logs.js');
const WAServer = require('./app/server/WAServer.js');

module.exports = {
    app,
    Server,
    url,
    logger,
    WAServer
}