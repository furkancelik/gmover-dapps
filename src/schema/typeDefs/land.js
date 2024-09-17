import { gql } from "graphql-tag";

export const landTypeDefs = gql`
  type Twitter {
    id: String
    screen_name: String
  }

  type Discord {
    id: String
    username: String
    email: String
  }

  type Land {
    id: ID!
    walletAddress: String!
    gridState: [[String]]!
    resources: Int!
    lastResourceClaimTime: String
    twitter: Twitter
    discord: Discord
    createdAt: String!
    updatedAt: String!
  }

  input TwitterInput {
    id: String!
    screen_name: String!
  }

  input DiscordInput {
    id: String!
    username: String!
    email: String
  }

  input LandInput {
    walletAddress: String!
    gridState: [[String]]!
    resources: Int
    lastResourceClaimTime: String
    twitter: TwitterInput
    discord: DiscordInput
  }

  extend type Query {
    getLand(walletAddress: String!): Land
    getAllLands: [Land]
  }

  extend type Mutation {
    createLand(input: LandInput!): Land
    updateLand(walletAddress: String!, input: LandInput!): Land
    claimResources(walletAddress: String!): Land
    updateTwitter(landId: ID!, twitter: TwitterInput!): Land
    updateDiscord(landId: ID!, discord: DiscordInput!): Land
  }
`;
