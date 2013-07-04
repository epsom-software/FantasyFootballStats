///<reference path='Definitions\all.d.ts'/>
var query;
(function (query) {
    var QueryEngine = (function () {
        function QueryEngine() { }
        QueryEngine.prototype.parseQuery = function (query) {
            var mappings = [];
            if(RegExp('^select ').test(query)) {
                mappings.push(function (player, result) {
                    query.split(' ').forEach(function (field) {
                        return result[field] = player[field];
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
