const { app, Server, url, logger, WAServer } = require("./autoload.js");

const server = new app();
const { hostname, port } = url.parse(process.env.URL);

const serverHttp = server.app.listen(port || 5234, hostname, () => {
    logger.info(`Server running at ${process.env.URL}`);
});

const io = new Server(serverHttp)

new WAServer(io);

server.app.get("/", (req, res) => {
    res.redirect(process.env.URL + '/dash');
});