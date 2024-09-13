import { gql } from "graphql-tag";

export const taskTypeDefs = gql`
  type Task {
    id: ID!
    userId: String!
    landId: String!
    taskId: String!
    xpReward: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getTasks(userId: String!): [Task]
    getTotalXpReward(landId: String!): Int
    getSpecificTask(landId: String!, taskId: String!): Task
  }

  type Mutation {
    addTask(
      userId: String!
      landId: String!
      taskId: String!
      xpReward: Int!
    ): Task
  }
`;
