import { gql } from "graphql-tag";

export const subscribersTypeDefs = gql`
  type Subscribers {
    id: ID!
    email: String!
  }

  input SubscribersInput {
    email: String!
  }

  extend type Mutation {
    addSubscribers(input: SubscribersInput!): Subscribers
  }
`;
