///<reference path='Definitions\all.d.ts'/>

module query {
    export class QueryEngine {

        players: model.player[];

        parseQuery(query: string): { (player: model.player, result: any): void; }[] {

            query = query.replace("*", " transfers_out code event_total last_season_points squad_number transfers_balance event_cost web_name in_dreamteam team_code id first_name transfers_out_event element_type_id max_cost selected min_cost total_points type_name team_name status form current_fixture now_cost points_per_game transfers_in original_cost event_points next_fixture transfers_in_event selected_by team_id second_name ");
            query = query.toLowerCase().replace(/\\s+/g, " ").trim();

            var mappings: { (player: model.player, result: any): void; }[] = [];
            
            if (/^select /.test(query)) {

                query = query.replace("select ", "");
                
                var fields = query.split(" ");

                mappings.push(function (player: model.player, result: any) {
                    fields.forEach(field => {
                        result[field] = player[field]
                    });
                });
            }

            return mappings;
        }

        run(query: string): any[] {

            var mappings = this.parseQuery(query);

            return this.players.map(p => {
                var result = {};
                mappings.forEach(m => m(p, result));
                return result;
            });
        }
    }

    (module ).exports = new QueryEngine();
}