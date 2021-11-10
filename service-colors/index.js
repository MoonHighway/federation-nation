const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const {
  addColor,
  countColors,
  findColors,
  findColor
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
    allColors: (_, __, { findColors }) => findColors()
  }
};

const start = async () => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs,
      resolvers
    }),
    context: ({ req }) => ({
      countColors,
      findColors,
      addColor,
      findColor
    })
  });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(
      `       🎨 🖍  - Color service running at: ${url}`
    );
  });
};

start();
