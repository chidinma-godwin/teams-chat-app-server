import { gql } from 'apollo-server-express';
export default gql`
    type Query {
        getUser(id: ID!): User!
        allUsers: [User!]!
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): User!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        team: String!
    }
`;