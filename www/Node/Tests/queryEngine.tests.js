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
            describe("select secondname", function () {
                var result = target("select secondname")[0];

                it("returns Fabianski", function () {
                    expect(result.secondname).to.equal("Fabianski");
                });
                it("doesn't return firstname", function () {
                    expect(result.firstname).to.be.undefined;
                });
            });

            describe("select firstname", function () {
                var result = target("select firstname");

                result.forEach(function (r) {
                    it("returns firstname", function () {
                        expect(r.firstname).to.have.length.greaterThan(0);
                    });
                    it("doesn't return secondname", function () {
                        expect(r.secondname).to.be.undefined;
                    });
                });
            });

            describe("select **", function () {
                var result = target("select **")[0];

                it("returns every available field", function () {
                    expect(result.added).to.not.be.undefined;
                    expect(result.code).to.not.be.undefined;
                    expect(result.currentfixture).to.not.be.undefined;
                    expect(result.eventcost).to.not.be.undefined;
                    expect(result.eventpoints).to.not.be.undefined;
                    expect(result.eventtotal).to.not.be.undefined;
                    expect(result.firstname).to.not.be.undefined;
                    expect(result.form).to.not.be.undefined;
                    expect(result.id).to.not.be.undefined;
                    expect(result.indreamteam).to.not.be.undefined;
                    expect(result.lastseasonpoints).to.not.be.undefined;
                    expect(result.maxcost).to.not.be.undefined;
                    expect(result.mincost).to.not.be.undefined;
                    expect(result.name).to.not.be.undefined;
                    expect(result.news).to.not.be.undefined;
                    expect(result.nextfixture).to.not.be.undefined;
                    expect(result.originalcost).to.not.be.undefined;
                    expect(result.pointspergame).to.not.be.undefined;
                    expect(result.secondname).to.not.be.undefined;
                    expect(result.selected).to.not.be.undefined;
                    expect(result.selectedby).to.not.be.undefined;
                    expect(result.status).to.not.be.undefined;
                    expect(result.teamid).to.not.be.undefined;
                    expect(result.teamname).to.equal("Arsenal");
                    expect(result.totalpoints).to.equal(13);
                    expect(result.transfersbalance).to.not.be.undefined;
                    expect(result.transfersin).to.not.be.undefined;
                    expect(result.transfersinevent).to.not.be.undefined;
                    expect(result.transfersout).to.not.be.undefined;
                    expect(result.transfersoutevent).to.not.be.undefined;
                    expect(result.typename).to.equal("Goalkeeper");
                });
            });

            describe("select *", function () {
                var result = target("select *")[0];

                it("returns only popular fields", function () {
                    var popularFields = [
                        'totalpoints',
                        'typename',
                        'teamname',
                        'transfersout',
                        'lastseasonpoints',
                        'transfersbalance',
                        'eventcost',
                        'name',
                        'indreamteam',
                        'status',
                        'form',
                        'cost',
                        'eventpoints',
                        'nextfixture',
                        'selectedby'
                    ];

                    var popularFieldsFlatterned = popularFields.sort().join();
                    var resultFlatterned = Object.keys(result).sort().join();

                    expect(resultFlatterned).to.equal(popularFieldsFlatterned);
                });
            });

            it("is case insensitive", function () {
                var result = target("sELecT secondname")[0];
                expect(result.secondname).to.equal("Fabianski");
            });

            it("ignores extra whitespace", function () {
                var result = target("  \nselect \r\n  \t secondname  ")[0];
                expect(result.secondname).to.equal("Fabianski");
            });
        });

        describe("define", function () {
            it("lets you create your own field", function () {
                var result = target("define (secondname) as surname\nselect surname")[0];
                expect(result.surname).to.equal("Fabianski");
            });
            it("lets you create multiple fields", function () {
                var result = target("define (secondname) as surname (firstname) as nickname\nselect surname nickname")[0];
                expect(result.surname).to.equal("Fabianski");
                expect(result.nickname).to.equal("Lukasz");
            });
            it("lets you combine standard fields with custom fields", function () {
                var result = target("define (secondname) as surname (firstname) as nickname\nselect firstname surname secondname nickname")[0];
                expect(result.secondname).to.equal("Fabianski");
                expect(result.firstname).to.equal("Lukasz");
                expect(result.surname).to.equal("Fabianski");
                expect(result.nickname).to.equal("Lukasz");
            });
            it("lets you combine * with custom fields", function () {
                var result = target("define (secondname) as surname (firstname) as nickname\nselect surname * nickname")[0];
                expect(result.surname).to.equal("Fabianski");
                expect(result.nickname).to.equal("Lukasz");
                expect(result.name).to.equal("Fabianski");
            });
            it("support floats", function () {
                var result = target("define (5.2) as float select float");
                expect(result[0].float).to.equal(5.2);
            });

            describe("simple operators", function () {
                var repoPlayer = repo.players[0];

                it("supports +", function () {
                    var result = target("define (firstname + secondname) as fullname\nselect fullname")[0];
                    expect(result.fullname).to.equal("LukaszFabianski");
                });
                it("supports -", function () {
                    var result = target("define (transfersout - transfersin) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfersout - repoPlayer.transfersin);
                });
                it("supports *", function () {
                    var result = target("define (transfersout * transfersin) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfersout * repoPlayer.transfersin);
                });
                it("supports /", function () {
                    var result = target("define (transfersout / transfersin) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfersout / repoPlayer.transfersin);
                });
                it("supports multiple complex definitions", function () {
                    var result = target("define (transfersout * transfersin) as times (transfersout / transfersin) as divide\nselect times divide")[0];
                    expect(result.times).to.equal(repoPlayer.transfersout * repoPlayer.transfersin);
                    expect(result.divide).to.equal(repoPlayer.transfersout / repoPlayer.transfersin);
                });
                it("supports adding multiple values", function () {
                    var result = target("define (transfersout + transfersin + totalpoints) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfersout + repoPlayer.transfersin + repoPlayer.totalpoints);
                });
                it("supports brackets", function () {
                    var result = target("define ((transfersout + transfersin) / (transfersout + transfersin)) as result\nselect result")[0];
                    expect(result.result).to.equal(1);
                });
                it("supports string literals", function () {
                    var result = target("define (firstname + ' ' + secondname) as fullname\nselect fullname")[0];
                    expect(result.fullname).to.equal("Lukasz Fabianski");
                });
                it("supports numbers", function () {
                    var result = target("define (transfersout * 2) as result\nselect result")[0];
                    expect(result.result).to.equal(repoPlayer.transfersout * 2);
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
                var result = target("select * where secondname = 'Fabianski'");
                expect(result.length).to.equal(1);
            });
            it("should support = for numbers", function () {
                var result = target("select * where code = 37096");
                expect(result.length).to.equal(1);
            });
            it("should support floats", function () {
                var result = target("select pointspergame where pointspergame = 5.2");
                expect(result.length).to.equal(1);
            });
            it("should support brackets", function () {
                var result = target("select * where (secondname = 'Fabianski')");
                expect(result.length).to.equal(1);
            });
            it("should support nested brackets", function () {
                var result = target("select * where (((2 + 2) = ((1 + 1) + (1 + 1))))");
                expect(result.length).to.equal(2);
            });
            it("should support <>", function () {
                var result = target("select * where code <> 37096");
                expect(result.length).to.equal(1);
            });
            it("should support >", function () {
                var result = target("select * where code > 59935");
                expect(result.length).to.equal(1);
            });
            it("should support >=", function () {
                var result = target("select * where code >= 59936");
                expect(result.length).to.equal(1);
            });
            it("should support <", function () {
                var result = target("select * where code < 37097");
                expect(result.length).to.equal(1);
            });
            it("should support <=", function () {
                var result = target("select * where code <= 37096");
                expect(result.length).to.equal(1);
            });
            it("should support and", function () {
                var result = target("select * where (code = 37096) and (code = 37096)");
                expect(result.length).to.equal(1);
            });
            it("should support or", function () {
                var result = target("select * where (code = 37096) or (code = 2)");
                expect(result.length).to.equal(1);
            });
        });

        describe("orderby", function () {
            it("supports asc", function () {
                var result = target("select pointspergame orderby pointspergame asc");
                expect(result[0].pointspergame).to.equal(4.1);
                expect(result[1].pointspergame).to.equal(5.2);
            });
            it("supports desc", function () {
                var result = target("select pointspergame orderby pointspergame desc");
                expect(result[0].pointspergame).to.equal(5.2);
                expect(result[1].pointspergame).to.equal(4.1);
            });
            it("defaults to desc", function () {
                var result = target("select pointspergame orderby pointspergame");
                expect(result[0].pointspergame).to.equal(5.2);
                expect(result[1].pointspergame).to.equal(4.1);
            });
            it("checks order when selecting top", function () {
                var result = target("select top 1 pointspergame orderby pointspergame asc");
                expect(result[0].pointspergame).to.equal(4.1);
            });
        });
    });
})(queryEngineTests || (queryEngineTests = {}));
//@ sourceMappingURL=queryEngine.tests.js.map
