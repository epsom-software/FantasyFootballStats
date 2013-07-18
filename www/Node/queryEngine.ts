///<reference path='allTypings.d.ts'/>

module QueryEngine {

    function error(message: string, value?) {
        console.log("Error: " + message, value);
        throw (message + ": " + value);
    }

    class QueryModel {

        private matchSubquery(keyword: string, query: string): string {
            var regex = new RegExp("\\b" + keyword + "\\b.+$");
            var matches = regex.exec(query);
            if (matches && matches.length > 0) {
                return matches[0];
            } else {
                return null;
            }
        }

        private initaliseField(keyword: string, query: string): string {
            var subquery = this.matchSubquery(keyword, query);

            if (subquery) {
                this[keyword] = subquery.replace(keyword + " ", "");
                return query.replace(subquery, "");
            } else {
                return query;
            }
        }

        constructor(queryValue: string) {

            queryValue = queryValue.toLowerCase().replace(/\s+/g, " ").trim();
            queryValue = this.initaliseField("orderby", queryValue);
            queryValue = this.initaliseField("where", queryValue);
            queryValue = this.initaliseField("select", queryValue);

            //Insert all available fields:
            this.select = this.select.replace("**", " transfers_out code event_total last_season_points squad_number transfers_balance event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected min_cost total_points type_name team_name status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture transfers_in_event selected_by team_id second_name ");

            //Insert popular fields:
            this.select = this.select.replace("*", " total_points type_name team_name transfers_out last_season_points transfers_balance event_cost web_name in_dreamteam status form now_cost event_points next_fixture selected_by ");

            queryValue = this.initaliseField("define", queryValue);
        }

        public define: string;
        public select: string;
        public where: string;
        public orderby: string;
    }

    export class Runner {

        public static players: model.player[];

        private selections: string[];
        private definitions: any = { where: () => true };
        private top: number = Number.MAX_VALUE;
        private sortComparison: (a: model.player, b: model.player) => number;

        constructor(queryValue: string) {
            var subqueries: QueryModel = new QueryModel(queryValue);

            this.define(subqueries.define);
            this.select(subqueries.select);
            this.where(subqueries.where);
            this.orderby(subqueries.orderby);
        }

        public run(): any[] {

            var result = Runner.players
                .filter((p) => this.evaluateField(p, "where"))
                .map(p => {
                    var result = {};
                    this.selections.forEach(s => {
                        if (s.length > 0) {
                            result[s] = this.evaluateField(p, s)
                        }
                    });
                    return result;
                });

            if (this.sortComparison) {
                result = result.sort(this.sortComparison);
            }

            result = result.splice(0, this.top);
            return result;
        }

        private select(subquery: string) {
            var topQuery = /^top (\d+) /.exec(subquery);
            if (topQuery) {
                this.top = parseInt(topQuery[1], 10);
                subquery = subquery.replace(topQuery[0], "");
            }


            this.selections = subquery.split(" ");
        }

        private define(subquery: string): void {

            if (subquery) {

                var matches;
                while (matches = /\((.+?)\) as (\w+)/.exec(subquery)) {

                    var wholeMatch: string = matches[0].toString();
                    var expression: string = matches[1].toString();
                    var field: string = matches[2].toString();

                    subquery = subquery.replace(wholeMatch, "");

                    this.buildExpression(field, expression, /^[\w\s\-+*/'\(\)]+$/);
                }
            }
        }

        private where(subquery: string): void {
            
            if (subquery) {
                this.buildExpression("where", subquery, /^[\w\s=\'\(\)+<>]+$/);
            }
        }

        private nextUniqueName = (function () {
            var i = 0;
            return function () {
                return "76ea17283fcf44ccabbc9a99ab96895c_" + (++i);
            }
        })();

        private buildExpression(field:string, expression: string, supportedCharactors: RegExp): void {

            if (!supportedCharactors.test(expression)) {
                error("Unsupported charactors in expression", expression);
            }

            while (expression.indexOf("(") != -1) {
                var match = expression.match(/\(([^()]+)\)/);
                var subExpression = match[0];
                var innerSubExpression = match[1];
                var uniqueName = this.nextUniqueName();

                //Replace all:
                expression = expression.split(subExpression).join(uniqueName)

                this.buildExpression(uniqueName, innerSubExpression, supportedCharactors);
            }

            var args: string[] = expression.match(/[^\s']+|'.*?'/g);

            this.definitions[field] = (p: model.player) => {
                return this.applyOperators(p, args);
            };
        }
        
        private equal(left, right): boolean {
            return (left + "").toLowerCase() == (right + "").toLowerCase();
        }


        private applyOperators(p: model.player, args: string[]) {
            
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
        }

        private evaluateField(p: model.player, field: string) {
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
        }

        private orderby(subquery: string): void {

            if (subquery) {
                var match = subquery.match(/(\w+)(\s+(asc|desc))?/);

                var field: string = match[1];
                var ascModifier: number = (match[3] == "asc") ? 1 : -1;
                
                this.sortComparison = (a: model.player, b: model.player) => {
                    
                    var aValue = this.evaluateField(a, field);
                    var bValue = this.evaluateField(b, field);

                    if (aValue > bValue) {
                        return ascModifier;
                    } else if (bValue > aValue) {
                        return -ascModifier;
                    } else {
                        return 0;
                    }
                }
            }
        }
    }

    module.exports = QueryEngine;
}