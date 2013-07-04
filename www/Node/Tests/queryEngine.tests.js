///<reference path='..\Definitions\all.d.ts'/>
///<reference path='.\playerRepository.ts'/>
var queryEngineTests;
(function (queryEngineTests) {
    var expect = require("chai").expect;
    var target = require("../queryEngine.js");
    var repo = require("./playerRepository.js");
    target.players = repo.players;
    describe("queryEngine ", function () {
        describe("select second_name", function () {
            var query = "select second_name";
            var result = target.run(query)[0];
            it("returns Fabianski", function () {
                expect(result.second_name).to.equal("Fabianski");
            });
            it("doesn't return first_name", function () {
                expect(result.first_name).to.be.undefined;
            });
        });
        describe("select first_name", function () {
            var query = "select first_name";
            var result = target.run(query);
            result.forEach(function (r) {
                it("returns first_name", function () {
                    expect(r.first_name).to.exist;
                    expect(r.first_name).to.have.length.greaterThan(0);
                });
                it("doesn't return second_name", function () {
                    expect(r.second_name).to.be.undefined;
                });
            });
        });
    });
})(queryEngineTests || (queryEngineTests = {}));
//@ sourceMappingURL=queryEngine.tests.js.map
