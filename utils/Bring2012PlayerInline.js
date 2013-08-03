
//This file will bring players in ./Data/Player/
//inline with ./Data/Player2013/
//and save it to your file system in ./Data/Player2012/

//To call this command from node, navigate to ./
//npm install request
//npm install fs
//node ./utils/match 13

function renameProperty(target, oldName, newName) {
    var temp = target[oldName];
    delete target[oldName];
    target[newName] = temp;
}

function scaleCost(object, property) {
    object[property] = object[property] / 10;
}

var playerId = process.argv[2];

var fs = require('fs');


var json = require('../Data/Player/' + playerId + '.json');
json = JSON.stringify(json, undefined, 2);
json = json.replace(/_/g, "");
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

//console.log(json);
fs.writeFile('./Data/Player2012/' + playerId + '.json', json);



