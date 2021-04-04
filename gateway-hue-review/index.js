const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const fetch = require("node-fetch");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    if (context.authorization) {
      const query = `query findUserEmail { me { email } }`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: context.authorization,
        },
        body: JSON.stringify({ query }),
      };

      const { data } = await fetch("http://localhost:4001", options)
        .then((res) => res.json())
        .catch(console.error);

      if (data && data.me) {
        request.http.headers.set("user-email", data.me.email);
      }

      request.http.headers.set("authorization", context.authorization);
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
