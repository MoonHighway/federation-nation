const { ApolloServer } = require("@apollo/server");
const {
  startStandaloneServer,
} = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const {
  addColor,
  countColors,
  findColors,
  findColor,
} = require("./lib");
const typeDefs = gql`
  scalar DateTime

  type Color {
    id: ID!
    title: String!
    value: String!
    created: DateTime!
    createdBy: User!
  }

  extend type User @key(fields: "email") {
    email: ID!
    postedColors: [Color!]!
  }

  type Query {
    totalColors: Int!
    allColors: [Color!]!
  }

  type Mutation {
    addColor(title: String!, value: String!): ColorPayload!
  }
  union ColorPayload = Error | Color
  type Error {
    message: String!
  }
`;
const resolvers = {
  Query: {
    totalColors: (_, __, { countColors }) => countColors(),
    allColors: (_, __, { findColors }) => findColors(),
  },
  User: {
    postedColors: ({ email }, _, { findColors }) =>
      findColors(email),
  },
  Mutation: {
    addColor: (
      _,
      { title, value },
      { currentUser, addColor }
    ) => {
      if (!currentUser) {
        return {
          message: "You must be logged in to add a color!",
        };
      }
      const color = addColor(currentUser, title, value);
      return color;
    },
  },
  ColorPayload: {
    __resolveType: (parent) =>
      parent.message ? "Error" : "Color",
  },
};
async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs,
      resolvers,
    }),
  });
  const { url } = await startStandaloneServer(server, {
    context: ({ req }) => ({
      countColors,
      findColors,
      addColor,
      findColor,
      currentUser: req.headers["user-email"],
    }),
    listen: { port: process.env.PORT },
  });
  console.log(`colors service running at: ${url}`);
}

startApolloServer();
