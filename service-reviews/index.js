const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const {
  addReview,
  findAllItemReviews,
  countReviews,
  findReviews,
  findReviewById,
} = require("./lib");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
  }
  type Query {
    totalReviews: Int!
    allReviews: [Review!]!
  }
`;

const resolvers = {
  Query: {
    totalReviews: (_, __, { countReviews, appID }) => countReviews(appID),
    allReviews: (_, __, { findReviews, appID }) => findReviews(appID),
  },
};

const start = async () => {
  const server = new ApolloServer({
    schema: buildFederatedSchema([
      {
        resolvers,
        typeDefs,
      },
    ]),
    context({ req }) {
      return {
        countReviews,
        findReviews,
        addReview,
        findAllItemReviews,
        findReviewById,
        appID: req.headers["app-id"],
      };
    },
  });
  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`⭐️ ⭐️ ⭐️ ⭐️ ⭐️  - Review service running at: ${url}`);
  });
};

start();
