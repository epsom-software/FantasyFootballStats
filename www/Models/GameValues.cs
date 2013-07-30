using System;
using System.Collections.Generic;

namespace FantasyFootballStats.Models
{
    public static class GameValues
    {
        public static readonly IEnumerable<string> Positions = new string[] {
            "Goalkeeper", "Defender", "Midfielder", "Forward"
        };

        public static readonly IEnumerable<string> Teams = new string[] {
            "Arsenal", "Aston Villa", "Cardiff City", "Chelsea", "Crystal Palace", 
            "Everton", "Fulham", "Hull City", "Liverpool", "Man City", 
            "Man Utd", "Newcastle", "Norwich", "Southampton", "Stoke City", 
            "Sunderland", "Swansea", "Tottenham", "West Brom", "West Ham"
        };

        public static readonly IEnumerable<string> PopularFields = new string[] { 
            "TotalPoints", "TypeName", "TeamName", "TransfersOut", "LastSeasonPoints", "TransfersBalance",
            "Eventcost", "Name", "InDreamTeam", "Status", "Form", "Cost", "EventPoints", "NextFixture", "SelectedBy" 
        };
    }
}
