import { gql } from "graphql-tag";

export const roleLimitTypeDefs = gql`
  type RoleLimit {
    id: ID!
    roleId: String!
    currentCount: Int!
    maxLimit: Int!
    createdAt: String!
    updatedAt: String!
  }

  type AddRoleResponse {
    success: Boolean!
    message: String!
  }

  extend type Query {
    getRoleLimit(roleId: String!): RoleLimit
    checkUserRole(userId: String!, roleId: String!): Boolean!
    checkUserInGuild(userId: String!): Boolean!
  }

  extend type Mutation {
    createOrUpdateRoleLimit(roleId: String!, maxLimit: Int!): RoleLimit
    addRoleToUser(userId: String!, roleId: String!): AddRoleResponse!
  }
`;
