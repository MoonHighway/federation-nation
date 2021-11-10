const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const trails = require("./trail-data.json");

const typeDefs = gql`
  type Trail {
    id: ID!
    name: String!
    status: TrailStatus!
    difficulty: Difficulty!
    groomed: Boolean!
    trees: Boolean!
    night: Boolean!
  }

  enum Difficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  enum TrailStatus {
    OPEN
    CLOSED
  }

  type Query {
    allTrails(status: TrailStatus): [Trail!]!
    Trail(id: ID!): Trail!
    trailCount(status: TrailStatus): Int!
  }

  type Mutation {
    setTrailStatus(id: ID!, status: TrailStatus!): Trail!
  }
`;
const resolvers = {
  Query: {
    allTrails: (root, { status }) =>
      !status
        ? trails
        : trails.filter(trail => trail.status === status),
    Trail: (root, { id }) =>
      trails.find(trail => id === trail.id),
    trailCount: (root, { status }) =>
      !status
        ? trails.length
        : trails.filter(trail => trail.status === status)
            .length
  },
  Mutation: {
    setTrailStatus: (root, { id, status }) => {
      let updatedTrail = trails.find(
        trail => id === trail.id
      );
      updatedTrail.status = status;
      return updatedTrail;
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers
  })
});

server.listen(process.env.PORT).then(({ url }) => {
  console.log(
    `🏔 Snowtooth - trail Service running at ${url}`
  );
});
