const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const {
  addAccount,
  findAllAccounts,
  findAccount,
  verifyPassword
} = require("./lib");
const jwt = require("jsonwebtoken");

const typeDefs = gql`
  scalar DateTime

  type User {
    email: ID!
    name: String!
    created: DateTime!
  }

  type Query {
    me: User
    accounts: [User!]!
  }

  input CreateAccountForm {
    email: String!
    name: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    createAccount(input: CreateAccountForm!): AuthPayload!
    authorize(
      email: String!
      password: String!
    ): AuthPayload!
  }
`;

const resolvers = {
  Query: {
    me: (_, __, { currentUser }) => currentUser,
    accounts: (_, __, { findAllAccounts }) =>
      findAllAccounts()
  },
  Mutation: {
    async createAccount(_, { input }, { addAccount }) {
      const user = await addAccount(input);
      const token = jwt.sign(
        { email: user.email },
        "graphqlyall"
      );
      return {
        token,
        user
      };
    },
    authorize(_, { email, password }, { findAccount }) {
      const user = findAccount(email);
      if (!user) {
        throw new Error(`account for ${email} not found`);
      }
      if (!verifyPassword(user, password)) {
        throw new Error(
          `password for ${email} is incorrect`
        );
      }
      const token = jwt.sign(
        { email: user.email },
        "graphqlyall"
      );
      return {
        token,
        user
      };
    }
  }
};

const start = async () => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs,
      resolvers
    }),
    mocks: true,
    mockEntireSchema: false,
    context({ req }) {
      let currentUser = null;
      if (req.headers.authorization) {
        try {
          const { email } = jwt.verify(
            req.headers.authorization,
            "graphqlyall"
          );
          currentUser = findAccount(email);
        } catch (error) {
          throw new Error(`invalid authorization token`);
        }
      }
      return {
        currentUser,
        addAccount,
        findAccount,
        findAllAccounts,
        verifyPassword
      };
    }
  });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(
      `     👨‍👨‍👧‍👦   - Account service running at: ${url}`
    );
  });
};

start();
