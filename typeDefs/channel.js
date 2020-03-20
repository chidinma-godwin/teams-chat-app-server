import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createChannel(
      teamId: ID!
      name: String!
      public: Boolean = false
    ): ChannelResponse!
  }

  type ChannelResponse {
    ok: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type Channel {
    id: ID!
    name: String!
    public: Boolean!
    users: [User!]!
    messages: [Message!]!
  }
`;
