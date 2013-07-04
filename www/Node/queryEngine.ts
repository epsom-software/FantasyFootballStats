///<reference path='Definitions\all.d.ts'/>

module query {
    export class QueryEngine {

        players: model.player[];

        parseQuery(query: string): { (player: model.player, result: any): void; }[] {

            var mappings: { (player: model.player, result: any): void; }[] = [];

            if (RegExp('^select ').test(query)) {

                mappings.push(function (player: model.player, result: any) {
                    query.split(' ').forEach(field => result[field] = player[field]);
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