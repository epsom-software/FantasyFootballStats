///<reference path='Definitions\all.d.ts'/>
var query;
(function (query) {
    var Mapping = (function () {
        function Mapping(map) {
            this.map = map;
        }
        return Mapping;
    })();    
    var Query = (function () {
        function Query(query) {
            query = this.initaliseField("select", query);
            query = this.initaliseField("define", query);
        }
        Query.prototype.matchSubquery = function (keyword, query) {
            var regex = new RegExp("\\b" + keyword + " .+$");
            var matches = regex.exec(query);
            if(matches && matches.length > 0) {
                return matches[0];
            } else {
                return null;
            }
        };
        Query.prototype.initaliseField = function (keyword, query) {
            var subquery = this.matchSubquery(keyword, query);
            if(subquery) {
                this[keyword] = subquery.replace(keyword + " ", "");
                return query.replace(subquery, "");
            } else {
                return null;
            }
        };
        return Query;
    })();    
    var QueryEngine = (function () {
        function QueryEngine() { }
        QueryEngine.prototype.parseQuery = function (query) {
            query = query.replace("*", " transfers_out code event_total last_season_points squad_number transfers_balance event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected min_cost total_points type_name team_name status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture transfers_in_event selected_by team_id second_name ");
            query = query.toLowerCase().replace(/\s+/g, " ").trim();
            var mappings = [];
            var subqueries = new Query(query);
            var definitions = this.define(subqueries.define);
            this.select(subqueries.select, mappings, definitions);
            return mappings;
        };
        QueryEngine.prototype.run = function (query) {
            var mappings = this.parseQuery(query);
            return this.players.map(function (p) {
                var result = {
                };
                mappings.forEach(function (m) {
                    return m.map(p, result);
                });
                return result;
            });
        };
        QueryEngine.prototype.select = function (subquery, mappings, definitions) {
            var fields = subquery.split(" ");
            mappings.push(new Mapping(function (player, result) {
                fields.forEach(function (field) {
                    if(player[field] != undefined) {
                        result[field] = player[field];
                    } else if(definitions[field] != undefined) {
                        result[field] = definitions[field](player);
                    }
                });
            }));
        };
        QueryEngine.prototype.define = function (subquery) {
            var result = {
            };
            if(subquery) {
                var matches;
                while(matches = /\((\w+)\) as (\w+)/.exec(subquery)) {
                    var wholeMatch = matches[0].toString();
                    var expression = matches[1].toString();
                    var field = matches[2].toString();
                    subquery = subquery.replace(wholeMatch, "");
                    result[field] = (function (expression) {
                        return function (player) {
                            return player[expression];
                        };
                    })(expression);
                }
            }
            return result;
        };
        return QueryEngine;
    })();
    query.QueryEngine = QueryEngine;    
    (module).exports = new QueryEngine();
})(query || (query = {}));
//@ sourceMappingURL=queryEngine.js.map
