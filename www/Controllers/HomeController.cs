using FantasyFootballStats.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FantasyFootballStats.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var model = new PlayerFilter();
            return View(model);
        }

        [HttpPost]
        public ActionResult Index(PlayerFilter model)
        {
            return View(model);
        }
    }
}
