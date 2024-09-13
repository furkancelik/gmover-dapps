import { mergeResolvers } from "@graphql-tools/merge";

import { subscribersResolvers } from "./subscribers";
import { landResolvers } from "./land";
import { roleLimitResolvers } from "./roleLimit";
import { taskResolvers } from "./task";

export const resolvers = mergeResolvers([
  subscribersResolvers,
  landResolvers,
  roleLimitResolvers,
  taskResolvers,
]);
