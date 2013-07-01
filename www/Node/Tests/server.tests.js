///<reference path='..\Definitions\all.d.ts'/>
///<reference path='..\server.ts'/>
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
//@ sourceMappingURL=server.tests.js.map
