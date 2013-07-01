///<reference path='..\Definitions\all.d.ts'/>
///<reference path='..\queryEngine.ts'/>

var expect: (target: any) => chai.ExpectMatchers = require("chai").expect;
var target: QueryEngine = require("../queryEngine.js");
    
describe("queryEngine tests", function () {
    describe("select GoalsScored", function () {
        it("the first player has scored 5", function () {
            var query = "select GoalsScored";
            var result = target.run(query);
            expect(result).to.be.a("array");
            expect(result.length).to.be.above(0);
            expect(result[0].GoalsScored).to.equal(5);
        });
    });
});

