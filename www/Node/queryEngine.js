///<reference path='Definitions\all.d.ts'/>
var query;
(function (query) {
    var QueryEngine = (function () {
        function QueryEngine() { }
        QueryEngine.prototype.parseQuery = function (query) {
            query = query.replace("*", " transfers_out code event_total last_season_points squad_number transfers_balance event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected min_cost total_points type_name team_name status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture transfers_in_event selected_by team_id second_name ");
            query = query.toLowerCase().replace(/\\s+/g, " ").trim();
            var mappings = [];
            if(/^select /.test(query)) {
                query = query.replace("select ", "");
                var fields = query.split(" ");
                mappings.push(function (player, result) {
                    fields.forEach(function (field) {
                        result[field] = player[field];
                    });
                });
            }
            return mappings;
        };
        QueryEngine.prototype.run = function (query) {
            var mappings = this.parseQuery(query);
            return this.players.map(function (p) {
                var result = {
                };
                mappings.forEach(function (m) {
                    return m(p, result);
                });
                return result;
            });
        };
        return QueryEngine;
    })();
    query.QueryEngine = QueryEngine;    
    (module).exports = new QueryEngine();
})(query || (query = {}));
//@ sourceMappingURL=queryEngine.js.map
