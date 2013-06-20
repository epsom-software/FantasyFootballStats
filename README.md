#Fantasy Football Stats

Query for custom statistics for fantasy football.

See it running here: http://fantasyfootballstats.azurewebsites.net/

This is still in the early days and not 100% sure where it is going.  
The project was started in ASP.NET MVC, but then released that all the data is both sent and received as JSON.
So maybe, rather than serialising to CLR objects and back again, why not use Node.js and keep everything as JavaScript.

So that is the direction it is headed in for the moment.

Successes so far:

- Running Node.js in Azure
- Running Node.js in IIS

Areas I'm looking into:

- TypeScript
- Unit tests for Node.js



##Install

1.  Clone repository from Github
1.  Install IISNode, following the instructions here: https://github.com/tjanczuk/iisnode
1.  In IIS, create a .NET site named FantasyFootballStats, which listens to http on port 83, rooted at .\www
1.  Install Node.js
1.  Add the following to your PATH (but correct the paths to whereever you installed these):  
C:\Users\username\AppData\Roaming\npm;C:\Program Files (x86)\nodejs\;C:\Program Files (x86)\Microsoft SDKs\TypeScript\;C:\node_modules\.bin
1.  npm install Mocha
1.  npm install Chai
1.  Set TypeScript to compile on save:
    2.  Open the FantasyFootballStats.sln in Visual Studio 2012.
    2.  Select Tools -> Options
    2.  Select Text Editor -> TypeScript -> Project -> General
    2.  Tick "Automatically compile TypeScript files which are not part of a project"
