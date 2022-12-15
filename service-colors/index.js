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
  }

  type Query {
    totalColors: Int!
    allColors: [Color!]!
  }
`;

const resolvers = {
  Query: {
    totalColors: (_, __, { countColors }) => countColors(),
    allColors: (_, __, { findColors }) => findColors(),
  },
};

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema ({
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
    }),
    listen: { port: process.env.PORT },
  });
  console.log(`colors service running at: ${url}`);
}

startApolloServer();
