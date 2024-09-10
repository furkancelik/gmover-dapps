import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";

import { subscribersTypeDefs } from "./subscribers";
import { landTypeDefs } from "./land";

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  subscribersTypeDefs,
  landTypeDefs,
]);
