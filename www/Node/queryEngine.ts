///<reference path='allTypings.d.ts'/>

module QueryEngine {

    class Mapping {
        constructor(public map: { (player: model.player, result: any): void; }) { }
    }

    class QueryModel {

        private matchSubquery(keyword: string, query: string): string {
            var regex = new RegExp("\\b" + keyword + " .+$");
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
                return null;
            }
        }

        constructor(queryValue: string) {

            queryValue = queryValue.toLowerCase().replace(/\s+/g, " ").trim();
            queryValue = this.initaliseField("select", queryValue);
            this.select = this.select.replace("*", " transfers_out code event_total last_season_points squad_number transfers_balance event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected min_cost total_points type_name team_name status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture transfers_in_event selected_by team_id second_name ");
            queryValue = this.initaliseField("define", queryValue);
        }

        public define: string;
        public select: string;
    }

    export class Runner {

        public static players: model.player[];

        private mappings: Mapping[] = [];
        private definitions: any = {};

        constructor(queryValue: string) {
            var subqueries: QueryModel = new QueryModel(queryValue);

            this.define(subqueries.define);
            this.select(subqueries.select);
        }

        public run(): any[] {

            return Runner.players.map(p => {
                var result = {};
                this.mappings.forEach(m => m.map(p, result));
                return result;
            });
        }

        private select(subquery: string) {

            var fields = subquery.split(" ");

            this.mappings.push(new Mapping((player, result) => {
                fields.forEach(field => {

                    if (player[field] != undefined) {
                        result[field] = player[field];
                    } else if (this.definitions[field] != undefined) {
                        result[field] = this.definitions[field](player);
                    }
                });
            }));
        }

        private define(subquery: string): void {
            
            if (subquery) {

                var matches;
                while (matches = /\((.+?)\) as (\w+)/.exec(subquery)) {

                    var wholeMatch: string = matches[0].toString();
                    var expression: string = matches[1].toString();
                    var field: string = matches[2].toString();

                    subquery = subquery.replace(wholeMatch, "");

                    this.buildExpression(field, expression);
                }
            }
        }

        private nextUniqueName = (function () {
            var i = 0;
            return function () {
                return "76ea17283fcf44ccabbc9a99ab96895c_" + (++i);
            }
        })();

        private buildExpression(field:string, expression: string): void {

            if (!/^[\w\s\-+*/'\(\)]+$/.test(expression)) {
                throw ("Unsupported charactors in expression: " + expression);
            }

            while (expression.indexOf("(") != -1) {
                var subExpression = expression.match(/\([^()]+\)/)[0];
                var innerSubExpression = subExpression.replace(/[()]/g, "");
                var uniqueName = this.nextUniqueName();

                //Replace all:
                expression = expression.split(subExpression).join(uniqueName)

                this.buildExpression(uniqueName, innerSubExpression);
            }

            var args: string[] = expression.match(/[^\s']+|'.*?'/g);

            this.definitions[field] = (p: model.player) => {

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
                    }
                }

                return result;
            };
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
    }

    module.exports = QueryEngine;
}