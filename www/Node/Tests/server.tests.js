///<reference path='..\allTypings.d.ts'/>
var serverTests;
(function (serverTests) {
    var expect = require("chai").expect;

    describe("some example tests", function () {
        describe("this one", function () {
            it("fails", function () {
                chai.expect(2).to.be.a("string");
            });
        });
        describe("this next one", function () {
            it("passes", function () {
                expect(2).to.be.a("number");
            });
        });
    });
})(serverTests || (serverTests = {}));
//@ sourceMappingURL=server.tests.js.map
