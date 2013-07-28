module model {

    export class player {
        added: Date;
        code: number;
        cost: number;
        currentfixture: string;
        eventcost: number;
        eventexplain: any;
        eventpoints: number;
        eventtotal: number;
        firstname: string;
        fixturehistory: any;
        form: number;
        id: number;
        indreamteam: bool;
        lastseasonpoints: number;
        maxcost: number;
        mincost: number;
        name: string;
        news: string;
        nextfixture: string;
        originalcost: number;
        pointspergame: number;
        seasonhistory: any;
        secondname: string;
        selected: number;
        selectedby: string;
        squadnumber: number;
        status: string;
        teamid: number;
        teamname: string;
        totalpoints: number;
        transfersbalance: number;
        transfersin: number;
        transfersinevent: number;
        transfersout: number;
        transfersoutevent: number;
        typename: string;
        
        public toString(): string {
            return this.name;
        }
    }
}
