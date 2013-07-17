///<reference path='..\allTypings.d.ts'/>
///<reference path='playerRepository.ts'/>
var queryEngineTests;
(function (queryEngineTests) {
    var expect = require("chai").expect;
    var QueryEngine = require("../queryEngine.js");

    function target(queryValue) {
        var queryEngine = new QueryEngine.Runner(queryValue);
        return queryEngine.run();
    }

    var repo = require("./playerRepository.js");
    QueryEngine.Runner.players = repo.players;

    describe("queryEngine ", function () {
        describe("select", function () {
            describe("select second_name", function () {
                var result = target("select second_name")[0];

                it("returns Fabianski", function () {
                    expect(result.second_name).to.equal("Fabianski");
                });
                it("doesn't return first_name", function () {
                    expect(result.first_name).to.be.undefined;
                });
            });

            describe("select first_name", function () {
                var result = target("select first_name");

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
                var result = target("select *")[0];

                it("returns all normal fields", function () {
                    expect(result.total_points).to.equal(13);
                    expect(result.type_name).to.equal("Goalkeeper");
                    expect(result.team_name).to.equal("Arsenal");
                    expect(result.transfers_out).to.not.be.undefined;
                    expect(result.code).to.not.be.undefined;
                    expect(result.event_total).to.not.be.undefined;
                    expect(result.last_season_points).to.not.be.undefined;

                    //expect(result.squad_number).to.not.be.undefined;
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
                var result = target("sELecT SEcond_nAMe")[0];
                expect(result.second_name).to.equal("Fabianski");
            });

            it("ignores extra whitespace", function () {
                var result = target("  \nselect \r\n  \t second_name  ")[0];
                expect(result.second_name).to.equal("Fabianski");
            });
        });

        describe("define", function () {
            it("lets you create your own field", function () {
                var result = target("define (second_name) as surname\nselect surname")[0];
                expect(result.surname).to.equal("Fabianski");
            });
            it("lets you create multiple fields", function () {
                var result = target("define (second_name) as surname (first_name) as nickname\nselect surname nickname")[0];
                expect(result.surname).to.equal("Fabianski");
                expect(result.nickname).to.equal("Lukasz");
            });
            it("lets you combine standard fields with custom fields", function () {
                var result = target("define (second_name) as surname (first_name) as nickname\nselect first_name surname second_name nickname")[0];
                expect(result.second_name).to.equal("Fabianski");
                expect(result.first_name).to.equal("Lukasz");
                expect(result.surname).to.equal("Fabianski");
                expect(result.nickname).to.equal("Lukasz");
            });
            it("lets you combine * with custom fields", function () {
                var result = target("define (second_name) as surname (first_name) as nickname\nselect surname * nickname")[0];
                expect(result.surname).to.equal("Fabianski");
                expect(result.nickname).to.equal("Lukasz");
                expect(result.second_name).to.equal("Fabianski");
                expect(result.first_name).to.equal("Lukasz");
            });

            describe("simple operators", function () {
                var repoPlayer = repo.players[0];

                it("supports +", function () {
                    var result = target("define (first_name + second_name) as full_name\nselect full_name")[0];
                    expect(result.full_name).to.equal("LukaszFabianski");
                });
                it("supports -", function () {
                    var result = target("define (transfers_out - transfers_in) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfers_out - repoPlayer.transfers_in);
                });
                it("supports *", function () {
                    var result = target("define (transfers_out * transfers_in) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfers_out * repoPlayer.transfers_in);
                });
                it("supports /", function () {
                    var result = target("define (transfers_out / transfers_in) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfers_out / repoPlayer.transfers_in);
                });
                it("supports multiple complex definitions", function () {
                    var result = target("define (transfers_out * transfers_in) as times (transfers_out / transfers_in) as divide\nselect times divide")[0];
                    expect(result.times).to.equal(repoPlayer.transfers_out * repoPlayer.transfers_in);
                    expect(result.divide).to.equal(repoPlayer.transfers_out / repoPlayer.transfers_in);
                });
                it("supports adding multiple values", function () {
                    var result = target("define (transfers_out + transfers_in + total_points) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfers_out + repoPlayer.transfers_in + repoPlayer.total_points);
                });
                it("supports brackets", function () {
                    var result = target("define ((transfers_out + transfers_in) / (transfers_out + transfers_in)) as result\nselect result")[0];
                    expect(result.result).to.equal(1);
                });
                it("supports string literals", function () {
                    var result = target("define (first_name + ' ' + second_name) as full_name\nselect full_name")[0];
                    expect(result.full_name).to.equal("Lukasz Fabianski");
                });
                it("supports numbers", function () {
                    var result = target("define (transfers_out * 2) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfers_out * 2);
                });
            });

            describe("select top 1 *", function () {
                it("returns a single row", function () {
                    var result = target("select top 1 *");
                    expect(result).to.satisfy(function (r) {
                        return r.length == 1;
                    });
                });
            });
        });

        describe("where", function () {
            it("should support = for strings", function () {
                var result = target("select * where second_name = 'Fabianski'");
                expect(result.length).to.equal(1);
            });
            it("should support = for numbers", function () {
                var result = target("select * where code = 315730");
                expect(result.length).to.equal(1);
            });
            it("should support brackets", function () {
                var result = target("select * where (second_name = 'Fabianski')");
                expect(result.length).to.equal(1);
            });
            it("should support nested brackets", function () {
                var result = target("select * where (((2 + 2) = ((1 + 1) + (1 + 1))))");
                expect(result.length).to.equal(2);
            });
            it("should support <>", function () {
                var result = target("select * where code <> 315730");
                expect(result.length).to.equal(1);
            });
            it("should support >", function () {
                var result = target("select * where code > 361544");
                expect(result.length).to.equal(1);
            });
            it("should support >=", function () {
                var result = target("select * where code >= 361545");
                expect(result.length).to.equal(1);
            });
            it("should support <", function () {
                var result = target("select * where code < 315731");
                expect(result.length).to.equal(1);
            });
            it("should support <=", function () {
                var result = target("select * where code <= 315730");
                expect(result.length).to.equal(1);
            });
            it("should support and", function () {
                var result = target("select * where (code = 315730) and (code = 315730)");
                expect(result.length).to.equal(1);
            });
            it("should support or", function () {
                var result = target("select * where (code = 315730) or (code = 2)");
                expect(result.length).to.equal(1);
            });
        });
    });
})(queryEngineTests || (queryEngineTests = {}));
//@ sourceMappingURL=queryEngine.tests.js.map
