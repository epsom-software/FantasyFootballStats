///<reference path='Definitions\node.d.ts' />
//This is a very simple http server.
var server;
(function (server) {
    var http = require('http');
    var port = process.env.PORT || 1337;
    http.createServer(function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Hello World from Node.js and TypeScript\n');
    }).listen(port);
})(server || (server = {}));
//@ sourceMappingURL=server.js.map
