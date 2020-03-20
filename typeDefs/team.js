import { gql } from "apollo-server-express";

export default gql`
  type Query {
    allTeams: [Team!]!
  }

  type Mutation {
    createTeam(name: String!): CreateTeamResponse
    addMember(teamId: ID!, email: String!): AddMemberResponse
  }

  type CreateTeamResponse {
    ok: Boolean
    team: Team
    errors: [Error!]
  }

  type AddMemberResponse {
    ok: Boolean
    errors: [Error!]
  }

  type Team {
    id: ID!
    name: String!
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
`;
