using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyFootballStats.Models
{
    public class PlayerFilter
    {
        public string Position { get; set; }
        public string[] Team { get; set; }

        public PlayerFilter()
        {
            Team = new string[0];
        }
    }
}