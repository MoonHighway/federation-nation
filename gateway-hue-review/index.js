const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const fetchUserEmail = require("./fetchUserEmail");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    if (context.authorization) {
      const email = await fetchUserEmail(context.authorization);
      if (email) {
        request.http.headers.set("user-email", email);
        request.http.headers.set("authorization", context.authorization);
      }
    }
    request.http.headers.set("app-id", "hue-review");
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://localhost:4001" },
    { name: "colors", url: "http://localhost:4002" },
    { name: "reviews", url: "http://localhost:4003" },
  ],
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const start = async () => {
  const context = ({ req }) => ({ authorization: req.headers.authorization });
  const server = new ApolloServer({ gateway, context, subscriptions: false });
  server.listen(process.env.PORT).then(({ url }) => {
    console.log(
      `      🎨  🖍  👩‍💻  ✅   - The Hue Review Gateway API running at ${url}`
    );
  });
};

setTimeout(start, 2000);
