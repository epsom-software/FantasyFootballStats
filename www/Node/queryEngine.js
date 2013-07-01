///<reference path='Definitions\all.d.ts'/>
var QueryEngine = (function () {
    function QueryEngine() { }
    QueryEngine.prototype.run = function (query) {
        return [
            {
                GoalsScored: 5
            }
        ];
    };
    return QueryEngine;
})();
(module).exports = new QueryEngine();
//@ sourceMappingURL=queryEngine.js.map
