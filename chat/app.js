require('dotenv').config()
var http = require('http');
var mongoose = require("mongoose");

var db = mongoose.connection;
mongoose.plugin(require('mongoose-autopopulate'));
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("DB OK");
});

console.log("test app.js");

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
});
server.listen();
