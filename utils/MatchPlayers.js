
//node ./utils/match 13

var fs = require('fs');
var playerId = process.argv[2];

var p2012 = [];
for(var i = 1; i < 707; i++) {
    p2012[i] = require('../Data/Player2012/' + i + '.json');
}

var p2013 = [];
for (var i = 1; i < 516; i++) {
    p2013[i] = require('../Data/Player2013/' + i + '.json');
}

function equals(left, right) {
    return left.firstname === right.firstname && left.secondname === right.secondname;
}

var matches = {};

function success(i2013, target, candidate) {
    
}

p2013.forEach(function(target, i2013) {
    p2012.forEach(function(candidate, i2012) {
        if(equals(target, candidate)) {
            matches[i2013] = i2012;

            success(i2013, target, candidate);
            return false;
        }
        return true;
    })
})

console.log(matches);
