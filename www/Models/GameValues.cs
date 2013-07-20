using System;
using System.Collections.Generic;

namespace FantasyFootballStats.Models
{
    public static class GameValues
    {
        public enum Position { Goalkeeper, Defender, Midfielder, Forward };
        public enum Team { Arsenal, AstonVilla, Chelsea, Everton, Fulham, Liverpool, ManCity, ManUtd, Newcastle, Norwich, QPR, Reading, Southampton, StokeCity, Sunderland, Swansea, Tottenham, WestBrom, WestHam, Wigan };

        public static IEnumerable<string> Positions
        {
            get
            {
                return Enum.GetNames(typeof(Position));
            }
        }

        public static IEnumerable<string> Teams
        {
            get
            {
                return Enum.GetNames(typeof(Team));
            }
        }

        public static readonly IEnumerable<string> PopularFields = new string[] { 
            "total_points", "type_name", "team_name", "transfers_out", "last_season_points", "transfers_balance",
            "event_cost", "web_name", "in_dreamteam", "status", "form", "now_cost", "event_points", "next_fixture", "selected_by" 
        };
    }
}
