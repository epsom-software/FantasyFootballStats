
//This file will download the player data from the fantasy site
//and save it to your file system in the ./www/Node/Data/Player/ directory.

//To call this command from node, navigate to ./
//npm install request
//npm install fs
//node ./utils/DownloadPlayer 13

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

var playerId = process.argv[2];

var url = 'http://fantasy.premierleague.com/web/api/elements/' + playerId + '/';
var file = './utils/Player/' + playerId + '.json';

var json = "";
request(url).on("data", function(chunk) {
    chunk = chunk.toString();
    chunk = chunk.replace(/_/g, "");
    json += chunk;
}).on("end", function() {

    json = JSON.parse(json);
    
    //Delete attributes we dont care about:
    delete json.photomobileurl;
    delete json.shirtimageurl;
    delete json.shirtmobileimageurl;
    delete json.newsupdated;
    delete json.newsadded;
    delete json.elementtypeid;
    delete json.teamcode;
    
    renameProperty(json, "webname", "name");
    renameProperty(json, "nowcost", "cost");
    
    
    //Move the larger properies to the bottom of the output:
    renameProperty(json, "seasonhistory", "seasonhistory");
    renameProperty(json, "fixtures", "fixtures");
    
    scaleCost(json, "eventcost")
    scaleCost(json, "maxcost")
    scaleCost(json, "mincost")
    scaleCost(json, "cost")
    scaleCost(json, "originalcost")
    
    json = JSON.stringify(json, undefined, 2);
    json = json.replace('"seasonhistory"', '\r\n\r\n"seasonhistory"');
    json = json.replace('"fixtures"', '\r\n\r\n"fixtures"');
    
    console.log(json);
    
    fs.writeFile(file, json);
});
