///<reference path='allTypings.d.ts' />

module download {

    var http = require('http');
    var url = require('url');
    var fs = require('fs');
    var downloadPlayer = require("../../utils/DownloadPlayer.js");
    var port = process.env.PORT || 1337;
    var repositoryDirectory = "../../Data/Player2013/";

    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1, 0, 0, 0);

    function downloadPlayers(nextPlayer) {
        var numberOfPlayers = 550;
        if (nextPlayer > numberOfPlayers) {
            return;
        }

        fs.stat(
            repositoryDirectory + nextPlayer + ".json",
            (err, stats) => {

                var success = false;

                if (stats && stats.mtime && stats.mtime < today) {
                    downloadPlayer.download(nextPlayer);
                    success = true;
                }

                if(success) {
                    setTimeout(() => downloadPlayers(nextPlayer + 1), 1000);
                } else {
                    downloadPlayers(nextPlayer + 1);
                }
            }
        );
    }

    http.createServer(function (req, res) {
        downloadPlayers(1);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Downloading in progress");
    }).listen(port);

} 