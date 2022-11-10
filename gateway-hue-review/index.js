const { ApolloServer } = require("@apollo/server");
const {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} = require("@apollo/gateway");
const {
  startStandaloneServer,
} = require("@apollo/server/standalone");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    if (context.authorization) {
      request.http.headers.set(
        "authorization",
        context.authorization
      );
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "users", url: "http://localhost:4001" },
      { name: "colors", url: "http://localhost:4002" },
    ],
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});
const start = async () => {
  const server = new ApolloServer({
    gateway,
  });
  const { url } = await startStandaloneServer(server, {
    context: ({ req }) => ({
      authorization: req.headers.authorization,
    }),
    listen: { port: process.env.PORT },
  });
  console.log(`Server running at ${url}`);
};
start();
