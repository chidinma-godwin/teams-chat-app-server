import { gql } from "apollo-server-express";
export default gql`
  type Query {
    getUser(id: ID!): User!
    allUsers: [User!]!
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
    ): RegisterResponse!
  }

  type Mutation {
    loginUser(email: String!, password: String!): LoginResponse
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    team: String!
  }
`;
