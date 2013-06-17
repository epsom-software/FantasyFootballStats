Fantasy Football Stats
====================

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

