using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyFootballStats.Models
{
    public static class DebugHelper
    {
        public static bool IsDebug
        {
            get
            {
#if DEBUG
                return true;
#else
                return false;
#endif
                }
            }
    }
}