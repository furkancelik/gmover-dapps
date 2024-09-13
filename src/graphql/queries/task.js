import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation AddTask(
    $userId: String!
    $landId: String!
    $taskId: String!
    $xpReward: Int!
  ) {
    addTask(
      userId: $userId
      landId: $landId
      taskId: $taskId
      xpReward: $xpReward
    ) {
      id
      userId
      landId
      taskId
      xpReward
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($userId: String!) {
    getTasks(userId: $userId) {
      id
      userId
      landId
      taskId
      xpReward
    }
  }
`;

export const GET_TOTAL_XP_REWARD = gql`
  query GetTotalXpReward($landId: String!) {
    getTotalXpReward(landId: $landId)
  }
`;

export const GET_SPECIFIC_TASK = gql`
  query GetSpecificTask($landId: String!, $taskId: String!) {
    getSpecificTask(landId: $landId, taskId: $taskId) {
      id
      userId
      landId
      taskId
      xpReward
      createdAt
    }
  }
`;
