using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace FantasyFootballStats.Models
{
    public class LoginModel
    {
        public string Password { get; set; }

        /// <summary>
        /// Really basic password protection.
        /// </summary>
        /// <returns>True if the login was succesful</returns>
        internal bool Login()
        {
            if (IsValidLogin())
            {
                FormsAuthentication.SetAuthCookie("registereduser", false);
                return true;
            }
            else
            {
                return false;
            }
        }

        private bool IsValidLogin()
        {
            string password = ConfigurationManager.AppSettings["password"];

            if (string.IsNullOrEmpty(password))
            {
                throw new InvalidOperationException("AppSettings[\"password\"] must be set.");
            }
            else
            {
                return string.Equals(password, Password, StringComparison.OrdinalIgnoreCase);
            }
        }
    }
}