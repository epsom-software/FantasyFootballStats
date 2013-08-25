
//This file will download the player data from the fantasy site
//and save it to your file system in the ./Data/Player2013/ directory.

function renameProperty(object, oldName, newName) {
    var temp = object[oldName];
    delete object[oldName];
    object[newName] = temp;
}
function scaleCost(object, property) {
    object[property] = object[property] / 10;
}


var request = require('request');
var fs = require('fs');

exports.download = function (playerId) {

    var url = 'http://fantasy.premierleague.com/web/api/elements/' + playerId + '/';
    var file = __dirname + '/../../Data/Player2013/' + playerId + '.json';

    var json = "";
    request(url).on("data", function (chunk) {
        chunk = chunk.toString();
        chunk = chunk.replace(/_/g, "");
        json += chunk;
    }).on("end", function () {

        json = JSON.parse(json);

        //Delete attributes which are not relevant to statistics:
        delete json.photomobileurl;
        delete json.shirtimageurl;
        delete json.shirtmobileimageurl;
        delete json.newsupdated;
        delete json.newsadded;
        delete json.newsreturn;
        delete json.elementtypeid;
        delete json.teamcode;
        delete json.fixtures;

        renameProperty(json, "webname", "name");
        renameProperty(json, "nowcost", "cost");


        //Move the larger properies to the bottom of the output:
        renameProperty(json, "seasonhistory", "seasonhistory");

        scaleCost(json, "eventcost")
        scaleCost(json, "maxcost")
        scaleCost(json, "mincost")
        scaleCost(json, "cost")
        scaleCost(json, "originalcost")

        json = JSON.stringify(json, undefined, 2);
        json = json.replace('"seasonhistory"', '\r\n\r\n"seasonhistory"');
        json = json.replace('"fixtures"', '\r\n\r\n"fixtures"');

        //console.log(json);

        fs.writeFile(file, json);
    });
};
