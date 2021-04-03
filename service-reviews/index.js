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
  scalar DateTime

  type Review @key(fields: "id") {
    id: ID!
    itemID: ID!
    rating: Int!
    comment: String
    user: User!
    created: DateTime!
  }

  type ReviewableItem @key(fields: "itemID") {
    itemID: ID!
    average: Float!
    reviews: [Review!]!
  }

  extend type User @key(fields: "email") {
    email: ID! @external
  }

  extend type Query {
    totalReviews: Int!
    allReviews: [Review!]!
  }

  input ReviewForm {
    itemID: ID!
    rating: Int!
    comment: String
  }

  type Mutation {
    addReview(input: ReviewForm!): Review!
  }
`;

const resolvers = {
  Query: {
    totalReviews: (_, __, { countReviews, appID }) => countReviews(appID),
    allReviews: (_, __, { findReviews, appID }) => findReviews(appID),
  },
  Mutation: {
    addReview(_, { input }, { currentUser, appID, addReview }) {
      return addReview(
        currentUser,
        appID,
        input.itemID,
        input.rating,
        input.comment
      );
    },
  },
  Review: {
    __resolveReference: ({ id }, { appID, findReviewById }) =>
      findReviewById(id, appID),
  },
  ReviewableItem: {
    __resolveReference: async ({ itemID }, { appID, findAllItemReviews }) =>
      findAllItemReviews(itemID, appID),
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
        currentUser: req.headers["user-email"],
        appID: req.headers["app-id"],
      };
    },
  });
  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`⭐️ ⭐️ ⭐️ ⭐️ ⭐️  - Review service running at: ${url}`);
  });
};

start();
