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
                    expect(r.first_name).to.have.length.greaterThan(0);
                });
                it("doesn't return second_name", function () {
                    expect(r.second_name).to.be.undefined;
                });
            });
        });
        describe("select *", function () {
            var query = "select *";
            var result = target.run(query)[0];
            it("returns all normal fields", function () {
                expect(result.total_points).to.equal(13);
                expect(result.type_name).to.equal("Goalkeeper");
                expect(result.team_name).to.equal("Arsenal");
                expect(result.transfers_out).to.not.be.undefined;
                expect(result.code).to.not.be.undefined;
                expect(result.event_total).to.not.be.undefined;
                expect(result.last_season_points).to.not.be.undefined;
                expect(result.squad_number).to.not.be.undefined;
                expect(result.transfers_balance).to.not.be.undefined;
                expect(result.event_cost).to.not.be.undefined;
                expect(result.web_name).to.not.be.undefined;
                expect(result.in_dreamteam).to.not.be.undefined;
                expect(result.team_code).to.not.be.undefined;
                expect(result.id).to.not.be.undefined;
                expect(result.first_name).to.not.be.undefined;
                expect(result.transfers_out_event).to.not.be.undefined;
                expect(result.element_type_id).to.not.be.undefined;
                expect(result.max_cost).to.not.be.undefined;
                expect(result.selected).to.not.be.undefined;
                expect(result.min_cost).to.not.be.undefined;
                expect(result.total_points).to.not.be.undefined;
                expect(result.type_name).to.not.be.undefined;
                expect(result.team_name).to.not.be.undefined;
                expect(result.status).to.not.be.undefined;
                expect(result.form).to.not.be.undefined;
                expect(result.current_fixture).to.not.be.undefined;
                expect(result.now_cost).to.not.be.undefined;
                expect(result.points_per_game).to.not.be.undefined;
                expect(result.transfers_in).to.not.be.undefined;
                expect(result.original_cost).to.not.be.undefined;
                expect(result.event_points).to.not.be.undefined;
                expect(result.next_fixture).to.not.be.undefined;
                expect(result.transfers_in_event).to.not.be.undefined;
                expect(result.selected_by).to.not.be.undefined;
                expect(result.team_id).to.not.be.undefined;
                expect(result.second_name).to.not.be.undefined;
            });
        });
        it("is case insensitive", function () {
            var query = "sELecT SEcond_nAMe";
            var result = target.run(query)[0];
            expect(result.second_name).to.equal("Fabianski");
        });
        it("ignores extra whitespace", function () {
            var query = "  \nselect \r\n  \t second_name  ";
            var result = target.run(query)[0];
            expect(result.second_name).to.equal("Fabianski");
        });
    });
})(queryEngineTests || (queryEngineTests = {}));
//@ sourceMappingURL=queryEngine.tests.js.map
