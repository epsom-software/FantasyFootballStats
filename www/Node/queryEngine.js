///<reference path='allTypings.d.ts'/>
var QueryEngine;
(function (QueryEngine) {
    function error(message, value) {
        console.log("Error: " + message, value);
        throw (message + ": " + value);
    }

    var QueryModel = (function () {
        function QueryModel(queryValue) {
            queryValue = queryValue.toLowerCase().replace(/\s+/g, " ").trim();
            queryValue = this.initaliseField("orderby", queryValue);
            queryValue = this.initaliseField("where", queryValue);
            queryValue = this.initaliseField("select", queryValue);

            //Insert all available fields:
            this.select = this.select.replace("**", " transfersout code eventtotal lastseasonpoints squadnumber transfersbalance eventcost indreamteam id firstname transfersoutevent maxcost eventexplain selected mincost totalpoints typename teamname status added form currentfixture pointspergame transfersin news originalcost eventpoints nextfixture transfersinevent selectedby teamid secondname name cost ");

            //Insert popular fields:
            this.select = this.select.replace("*", " totalpoints typename teamname transfersout lastseasonpoints transfersbalance eventcost name indreamteam status form cost eventpoints nextfixture selectedby ");

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
            this.orderby(subqueries.orderby);
        }
        Runner.prototype.run = function () {
            var _this = this;
            var result = Runner.players.filter(function (p) {
                return _this.evaluateField(p, "where");
            }).map(function (p) {
                var result = {};
                _this.selections.forEach(function (s) {
                    if (s.length > 0) {
                        result[s] = _this.evaluateField(p, s);
                    }
                });
                return result;
            });

            if (this.sortComparison) {
                result = result.sort(this.sortComparison);
            }

            result = result.splice(0, this.top);
            return result;
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

                    this.buildExpression(field, expression, /^[\w\s\-+*/'\(\)\.]+$/);
                }
            }
        };

        Runner.prototype.where = function (subquery) {
            if (subquery) {
                this.buildExpression("where", subquery, /^[\w\s=\'\(\)+<>\.]+$/);
            }
        };

        Runner.prototype.buildExpression = function (field, expression, supportedCharactors) {
            var _this = this;
            if (!supportedCharactors.test(expression)) {
                error("Unsupported charactors in expression", expression);
            }

            while (expression.indexOf("(") != -1) {
                var match = expression.match(/\(([^()]+)\)/);
                var subExpression = match[0];
                var innerSubExpression = match[1];
                var uniqueName = this.nextUniqueName();

                //Replace all:
                expression = expression.split(subExpression).join(uniqueName);

                this.buildExpression(uniqueName, innerSubExpression, supportedCharactors);
            }

            var args = expression.match(/[^\s']+|'.*?'/g);

            this.definitions[field] = function (p) {
                return _this.applyOperators(p, args);
            };
        };

        Runner.prototype.equal = function (left, right) {
            return (left + "").toLowerCase() == (right + "").toLowerCase();
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
                        result = this.equal(result, nextValue);
                        break;
                    case "<>":
                        result = !this.equal(result, nextValue);
                        break;
                    case ">":
                        result = parseFloat(result) > parseFloat(nextValue);
                        break;
                    case ">=":
                        result = parseFloat(result) >= parseFloat(nextValue);
                        break;
                    case "<":
                        result = parseFloat(result) < parseFloat(nextValue);
                        break;
                    case "<=":
                        result = parseFloat(result) <= parseFloat(nextValue);
                        break;
                    case "and":
                        if ((typeof result) != "boolean" || (typeof nextValue) != "boolean") {
                            error("Attempted to apply 'and' to a non-boolean");
                        }
                        result = result && nextValue;
                        break;
                    case "or":
                        if ((typeof result) != "boolean" || (typeof nextValue) != "boolean") {
                            error("Attempted to apply 'or' to a non-boolean");
                        }
                        result = result || nextValue;
                        break;
                    default:
                        error("operator not recognised", operator);
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

        Runner.prototype.orderby = function (subquery) {
            var _this = this;
            if (subquery) {
                var match = subquery.match(/(\w+)(\s+(asc|desc))?/);

                var field = match[1];
                var ascModifier = (match[3] == "asc") ? 1 : -1;

                this.sortComparison = function (a, b) {
                    var aValue = _this.evaluateField(a, field);
                    var bValue = _this.evaluateField(b, field);

                    if (aValue > bValue) {
                        return ascModifier;
                    } else if (bValue > aValue) {
                        return -ascModifier;
                    } else {
                        return 0;
                    }
                };
            }
        };
        return Runner;
    })();
    QueryEngine.Runner = Runner;

    module.exports = QueryEngine;
})(QueryEngine || (QueryEngine = {}));
//@ sourceMappingURL=queryEngine.js.map
