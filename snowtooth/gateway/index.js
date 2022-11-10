const { ApolloServer } = require("@apollo/server");
const {
  startStandaloneServer,
} = require("@apollo/server/standalone");
const {
  ApolloGateway,
  IntrospectAndCompose,
} = require("@apollo/gateway");
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "lifts", url: "http://localhost:5001" },
      { name: "trails", url: "http://localhost:5002" },
    ],
  }),
});
const start = async () => {
  const server = new ApolloServer({ gateway });
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT },
  });
  console.log(`Server running at ${url}`);
};

start();
