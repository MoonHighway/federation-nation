<p align="center">
<img src="https://cdn.worldvectorlogo.com/logos/apollo-graphql-compact.svg" width="100" alt="apollo logo" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/512px-GraphQL_Logo.svg.png" width="100" alt="graphql logo"/>
<img src="https://i.imgur.com/migo24P.png" width="100" alt="moon highway logo"/>
</p>

# Apollo GraphQL Federation Nation

Welcome to the Apollo Federation Nation GraphQL Course. We are assuming that you found these files because you are in the course. However, if you found them by some other means, welcome as well!

## Instructor Info

- **Alex Banks**: [Twitter](https://twitter.com/moontahoe) | [Email](mailto:alex@moonhighway.com)
- **Eve Porcello**: [Twitter](https://twitter.com/eveporcello) | [Email](mailto:eve@moonhighway.com)
- **Moon Highway Training**: [Moon Highway Website](https://www.moonhighway.com) | [Mailing List](http://bit.ly/moonhighway) | [Articles](https://www.moonhighway.com/articles)

## Slides

You can find the slides in the root of this project: `slides-federation.html`. Open in your browser to view.

## Clone the Repo

These files are your starting point. We are going to build and compose a wonderful collection of services. Clone or download these files to get started.


## Running the Complete Solution

After you have cloned the repo, simply checkout the [Completed Solution](https://github.com/MoonHighway/federation-nation/tree/complete-solution) branch to run the complete solution:

```
git checkout complete-solution
```

Then install the files:

```
npm install
```

This installer installs the files for each service, in every subfolder. Be patient. 

```
npm start
```

Once the files are installed, `npm start` will start one instance of each service using pm2. You can only run one instance of each service because this course does not use a persistent data layer. It was designed to teach federation, not build your entire architecture. It stores data in memory, so if you spin up more than one instance of each service, you will see some wacky results. 

The services should be running locally on the following ports. Please make sure you are not currently running any other applications locally on any of these ports:

| Service            | URL                   |
|--------------------|-----------------------|
| Hue Review Gateway | http://localhost:4000 |
| Snowtooth Gateway  | http://localhost:5000 |
| Accounts Service   | http://localhost:4001 |
| Reviews Service    | http://localhost:4003 |
| Color Service      | http://localhost:4002 |
| Lift Service       | http://localhost:5001 |
| Trail Service      | http://localhost:5002 |

You can also run the following npm commands:

| Command          | Description                      |
|------------------|----------------------------------|
| `npm start`      | Starts services using pm2        |
| `npm stop`       | Stops all running services       |
| `npm run delete` | Deletes all services from pm2    |
| `npm run logs`   | Shows log files for all services |

Additionally pm2 commands work: `pm2 flush`, `pm2 monit`, etc.

