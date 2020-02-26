import { gql } from 'apollo-server-express';

export default gql`
    type Mutation {
        createChannel(teamId: ID!, name: String!, public: Boolean=false): Boolean!
    }

    type Channel {
        id: ID!
        name: String!
        public: Boolean!
        users: [User!]!
        messages: [Message!]!
    }
`;