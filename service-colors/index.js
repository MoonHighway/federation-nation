const { ApolloServer, gql } = require("apollo-server");
const { addColor, countColors, findColors, findColor } = require("./lib");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  scalar DateTime

  type Color {
    id: ID!
    title: String!
    value: String!
    created: DateTime!
    createdBy: User!
    feedback: ReviewableItem!
  }

  extend type User @key(fields: "email") {
    email: ID! @external
    postedColors: [Color!]!
  }

  extend type ReviewableItem @key(fields: "itemID") {
    itemID: ID! @external
  }
  extend type Review @key(fields: "id") {
    id: ID! @external
    itemID: ID! @external
    color: Color! @requires(fields: "itemID")
  }

  type Query {
    totalColors: Int!
    allColors: [Color!]!
  }

  type Error {
    message: String!
  }

  union ColorPayload = Error | Color

  type Mutation {
    addColor(title: String!, value: String!): ColorPayload!
  }
`;

const resolvers = {
  Query: {
    totalColors: (_, __, { countColors }) => countColors(),
    allColors: (_, __, { findColors }) => findColors(),
  },
  User: {
    postedColors: ({ email }, _, { findColors }) => findColors(email),
  },
  Mutation: {
    addColor(_, { title, value }, { currentUser, addColor }) {
      if (!currentUser) {
        return {
          message: "You must be logged in to add a color",
        };
      }
      const color = addColor(currentUser, title, value);
      return color;
    },
  },
  ColorPayload: {
    __resolveType: (parent) => (parent.message ? "Error" : "Color"),
  },
  Color: {
    feedback: ({ id }) => ({ itemID: id }),
  },
  Review: {
    color: ({ itemID }, args, { findColor }) => findColor(itemID),
  },
};

const start = async () => {
  const server = new ApolloServer({
    schema: buildFederatedSchema({
      typeDefs,
      resolvers,
    }),
    context: ({ req }) => ({
      countColors,
      findColors,
      addColor,
      findColor,
      currentUser: req.headers["user-email"],
    }),
  });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`       🎨 🖍  - Color service running at: ${url}`);
  });
};

start();
