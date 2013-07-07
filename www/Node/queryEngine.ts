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
        private definitions: any;

        constructor(queryValue: string) {
            var subqueries: QueryModel = new QueryModel(queryValue);

            this.definitions = Runner.define(subqueries.define);
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

        private static define(subquery: string): any {
            var result = {};
            if (subquery) {

                var matches;
                while (matches = /\(([^\)]+)\) as (\w+)/.exec(subquery)) {

                    var wholeMatch: string = matches[0].toString();
                    var expression: string = matches[1].toString();
                    var field: string = matches[2].toString();

                    subquery = subquery.replace(wholeMatch, "");

                    result[field] = this.buildExpression(expression);
                }
            }
            return result;
        }

        private static buildExpression(expression: string) {

            if (!/^[\w\s\-+*/']+$/.test(expression)) {
                return function () {
                    return "Unsupported charactors in expression: " + expression;
                }
            }

            var args: string[] = expression.match(/[^\s']+|'.*?'/g);

            function getValue(p: model.player, field: string) {
                if (field[0] == "'") {
                    return field.replace(/'/g, ""); 
                }
                if (p[field] || p[field] === false) {
                    return p[field];
                }
            }

            return function (p: model.player) {

                var nextValue = args[0];

                var result = getValue(p, nextValue);

                for (var i = 1; i < args.length; i += 2) {

                    var operator = args[i];
                    nextValue = args[i + 1];
                    
                    switch (operator) {
                        case "+":
                            result += getValue(p, nextValue);
                            break;
                        case "-":
                            result -= getValue(p, nextValue);
                            break;
                        case "*":
                            result *= getValue(p, nextValue);
                            break;
                        case "/":
                            result /= getValue(p, nextValue);
                            break;
                    }
                }

                return result;
            }
        }
    }
    
    module.exports = QueryEngine;
}