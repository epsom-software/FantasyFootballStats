///<reference path='allTypings.d.ts'/>
var QueryEngine;
(function (QueryEngine) {
    var QueryModel = (function () {
        function QueryModel(queryValue) {
            queryValue = queryValue.toLowerCase().replace(/\s+/g, " ").trim();
            queryValue = this.initaliseField("where", queryValue);
            queryValue = this.initaliseField("select", queryValue);
            this.select = this.select.replace("*", " transfers_out code event_total last_season_points squad_number transfers_balance event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected min_cost total_points type_name team_name status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture transfers_in_event selected_by team_id second_name ");
            queryValue = this.initaliseField("define", queryValue);
        }
        QueryModel.prototype.matchSubquery = function (keyword, query) {
            var regex = new RegExp("\\b" + keyword + "\\b.+$");
            var matches = regex.exec(query);
            if (matches && matches.length > 0) {
                return matches[0];
            } else {
                return null;
            }
        };

        QueryModel.prototype.initaliseField = function (keyword, query) {
            var subquery = this.matchSubquery(keyword, query);

            if (subquery) {
                this[keyword] = subquery.replace(keyword + " ", "");
                return query.replace(subquery, "");
            } else {
                return query;
            }
        };
        return QueryModel;
    })();

    var Runner = (function () {
        function Runner(queryValue) {
            this.definitions = { where: function () {
                    return true;
                } };
            this.top = Number.MAX_VALUE;
            this.nextUniqueName = (function () {
                var i = 0;
                return function () {
                    return "76ea17283fcf44ccabbc9a99ab96895c_" + (++i);
                };
            })();
            var subqueries = new QueryModel(queryValue);

            this.define(subqueries.define);
            this.select(subqueries.select);
            this.where(subqueries.where);
        }
        Runner.prototype.run = function () {
            var _this = this;
            return Runner.players.filter(function (p, index) {
                return index < _this.top;
            }).filter(function (p) {
                return _this.evaluateField(p, "where");
            }).map(function (p) {
                var result = {};
                _this.selections.forEach(function (s) {
                    return result[s] = _this.evaluateField(p, s);
                });
                return result;
            });
        };

        Runner.prototype.select = function (subquery) {
            var topQuery = /^top (\d+) /.exec(subquery);
            if (topQuery) {
                this.top = parseInt(topQuery[1], 10);
                subquery = subquery.replace(topQuery[0], "");
            }

            this.selections = subquery.split(" ");
        };

        Runner.prototype.define = function (subquery) {
            if (subquery) {
                var matches;
                while (matches = /\((.+?)\) as (\w+)/.exec(subquery)) {
                    var wholeMatch = matches[0].toString();
                    var expression = matches[1].toString();
                    var field = matches[2].toString();

                    subquery = subquery.replace(wholeMatch, "");

                    this.buildExpression(field, expression);
                }
            }
        };

        Runner.prototype.where = function (subquery) {
            if (subquery) {
                this.buildClause("where", subquery);
            }
        };

        Runner.prototype.buildExpression = function (field, expression) {
            var _this = this;
            if (!/^[\w\s\-+*/'\(\)]+$/.test(expression)) {
                throw ("Unsupported charactors in expression: " + expression);
            }

            while (expression.indexOf("(") != -1) {
                var subExpression = expression.match(/\([^()]+\)/)[0];
                var innerSubExpression = subExpression.replace(/[()]/g, "");
                var uniqueName = this.nextUniqueName();

                //Replace all:
                expression = expression.split(subExpression).join(uniqueName);

                this.buildExpression(uniqueName, innerSubExpression);
            }

            var args = expression.match(/[^\s']+|'.*?'/g);

            this.definitions[field] = function (p) {
                return _this.applyOperators(p, args);
            };
        };

        Runner.prototype.buildClause = function (clauseId, expression) {
            var _this = this;
            if (!/^[\w\s=\'\(\)]+$/.test(expression)) {
                throw ("Unsupported charactors in expression: " + expression);
            }

            while (expression.indexOf("(") != -1) {
                var subExpression = expression.match(/\([^()]+\)/)[0];
                var innerSubExpression = subExpression.replace(/[()]/g, "");
                var uniqueName = this.nextUniqueName();

                //Replace all:
                expression = expression.split(subExpression).join(uniqueName);

                this.buildClause(uniqueName, innerSubExpression);
            }

            var args = expression.match(/[^\s']+|'.*?'/g);

            this.definitions[clauseId] = function (p) {
                return _this.applyOperators(p, args);
            };
        };

        Runner.prototype.applyOperators = function (p, args) {
            var result = this.evaluateField(p, args[0]);

            for (var i = 1; i < args.length; i += 2) {
                var operator = args[i];
                var nextValue = this.evaluateField(p, args[i + 1]);

                switch (operator) {
                    case "+":
                        result += nextValue;
                        break;
                    case "-":
                        result -= nextValue;
                        break;
                    case "*":
                        result *= nextValue;
                        break;
                    case "/":
                        result /= nextValue;
                        break;
                    case "=":
                        result = result.toLowerCase() == nextValue.toLowerCase();
                        break;
                }
            }

            return result;
        };

        Runner.prototype.evaluateField = function (p, field) {
            if (field[0] == "'") {
                return field.replace(/'/g, "");
            }
            if (p[field] != undefined) {
                return p[field];
            }
            if (this.definitions[field] != undefined) {
                return this.definitions[field](p);
            }
            return (parseFloat(field));
        };
        return Runner;
    })();
    QueryEngine.Runner = Runner;

    module.exports = QueryEngine;
})(QueryEngine || (QueryEngine = {}));
//@ sourceMappingURL=queryEngine.js.map
