import { gql } from "graphql-tag";

export const landTypeDefs = gql`
  type Land {
    id: ID!
    walletAddress: String!
    gridState: [[String]]!
    resources: Int!
    lastResourceClaimTime: String
    createdAt: String!
    updatedAt: String!
  }

  input LandInput {
    walletAddress: String!
    gridState: [[String]]!
    resources: Int
    lastResourceClaimTime: String
  }

  extend type Query {
    getLand(walletAddress: String!): Land
    getAllLands: [Land]
  }

  extend type Mutation {
    createLand(input: LandInput!): Land
    updateLand(walletAddress: String!, input: LandInput!): Land
    claimResources(walletAddress: String!): Land
  }
`;
