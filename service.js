var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var io = require('socket.io');
var cors = require('cors');

var port = process.env.PORT || 5000

var dbURL = 'mongodb://ds261247.mlab.com:61247/loanfree';
var dbAuth = {
    useMongoClient: false,
    user: "admin",
    pass: "superF12"
}
mongoose.connect(dbURL, dbAuth);

var ws = require('./wsactions.js');
var rest = require('./restactions.js');

var app = express(),
    server = http.createServer(app),
    io = io.listen(server)

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.start = app.listen = function () {
    console.log("Listening port %d", port);
    return server.listen.apply(server, arguments)
}

ws.init(io);
rest.init(app);

app.start(port);