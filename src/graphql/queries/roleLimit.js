import { gql } from "@apollo/client";

export const CHECK_USER_ROLE = gql`
  query CheckUserRole($userId: String!, $roleId: String!) {
    checkUserRole(userId: $userId, roleId: $roleId)
  }
`;

export const CHECK_XOG_LIMIT = gql`
  query CheckXOGLimit($roleId: String!) {
    getRoleLimit(roleId: $roleId) {
      currentCount
      maxLimit
    }
  }
`;

export const ADD_ROLE = gql`
  mutation AddRole($userId: String!, $roleId: String!) {
    addRoleToUser(userId: $userId, roleId: $roleId) {
      success
      message
    }
  }
`;

export const CHECK_USER_IN_GUILD = gql`
  query CheckUserInGuild($userId: String!) {
    checkUserInGuild(userId: $userId)
  }
`;
