///<reference path='allTypings.d.ts' />
//This is a very simple http server.
var server;
(function (server) {
    var http = require('http');
    var url = require('url');
    var fs = require('fs');
    var port = process.env.PORT || 1337;

    function loadPlayers() {
        var repositoryDirectory = "../../Data/Player2013/";
        var files = fs.readdirSync(repositoryDirectory);
        var json = files.map(function (f) {
            return require(repositoryDirectory + f);
        });
        return json;
    }

    var QueryEngine = require("./queryEngine.js");

    QueryEngine.Runner.players = loadPlayers();

    http.createServer(function (req, res) {
        var url_parts = url.parse(req.url, true);
        var code = url_parts.query.code;

        var queryEngine = new QueryEngine.Runner(code);
        var result = queryEngine.run();

        res.writeHead(200, { 'Content-Type': 'text/plain' });

        res.end(JSON.stringify(result));
    }).listen(port);
})(server || (server = {}));
//@ sourceMappingURL=server.js.map
