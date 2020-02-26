import { gql } from 'apollo-server-express';
export default gql `
    type Mutation {
        createMessage(text: String!, channelId: ID!): Boolean!
    }

    type Message {
        id: ID!
        text: String!
        user: User!
        channel: Channel!
    }
`;