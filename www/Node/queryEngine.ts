///<reference path='allTypings.d.ts'/>

module query {

    class Mapping {
        constructor(public map: { (player: model.player, result: any): void; }) { }
    }

    class Query {

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

        constructor(query: string) {
            query = this.initaliseField("select", query);
            query = this.initaliseField("define", query);
        }

        public define: string;
        public select: string;
    }

    export class QueryEngine {

        public players: model.player[];

        private parseQuery(query: string): Mapping[] {

            query = query.replace("*", " transfers_out code event_total last_season_points squad_number transfers_balance event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected min_cost total_points type_name team_name status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture transfers_in_event selected_by team_id second_name ");
            query = query.toLowerCase().replace(/\s+/g, " ").trim();

            var mappings: Mapping[] = [];
            
            var subqueries = new Query(query);

            var definitions = this.define(subqueries.define);

            this.select(subqueries.select, mappings, definitions);


            return mappings;
        }

        public run(query: string): any[] {

            var mappings: Mapping[] = this.parseQuery(query);

            return this.players.map(p => {
                var result = {};
                mappings.forEach(m => m.map(p, result));
                return result;
            });
        }

        private select(subquery: string, mappings: Mapping[], definitions: any) {

            var fields = subquery.split(" ");

            mappings.push(new Mapping((player, result) => {
                fields.forEach(field => {

                    if (player[field] != undefined) {
                        result[field] = player[field];
                    } else if (definitions[field] != undefined) {
                        result[field] = definitions[field](player);
                    }
                });
            }));
        }

        private define(subquery: string): any {
            var result = {};
            if (subquery) {

                var matches;
                while (matches = /\((\w+)\) as (\w+)/.exec(subquery)) {
                    
                    var wholeMatch: string = matches[0].toString();
                    var expression: string = matches[1].toString();
                    var field: string = matches[2].toString();

                    subquery = subquery.replace(wholeMatch, "");

                    result[field] = (function (expression: string) {
                        return (player: model.player) => player[expression];
                    })(expression);
                }
            }
            return result;
        }
    }

    (module ).exports = new QueryEngine();
}