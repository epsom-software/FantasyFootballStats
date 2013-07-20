#Fantasy Football Stats

Query for custom statistics for fantasy football.

This is still in the early days and not 100% sure where it is going.  
The project was started in ASP.NET MVC, but then released that all the data is both sent and received as JSON.
So maybe, rather than serialising to CLR objects and back again, why not use Node.js and keep everything as JavaScript.

So that is the direction it is headed in for the moment.

Successes so far:

- Running Node.js in Azure
- Running Node.js in IIS
- TypeScript


Areas I'm looking into:

- Unit tests for Node.js



##Install

1.  Clone repository from Github
1.  Install IISNode
    * Following the instructions here: https://github.com/tjanczuk/iisnode
1.  In IIS, create a .NET site named FantasyFootballStats
    * Listens to http on port 83
    * Rooted at .\www
1.  Install Node.js
    * Follow instructions here: http://nodejs.org/
1.  Set TypeScript to compile on save:
    * Open the FantasyFootballStats.sln in Visual Studio 2012.
    * Select Tools -> Options
    * Select Text Editor -> TypeScript -> Project -> General
    * Tick "Automatically compile TypeScript files which are not part of a project"


