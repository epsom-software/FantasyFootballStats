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
    }
}
