import { mergeResolvers } from "@graphql-tools/merge";

import { subscribersResolvers } from "./subscribers";
import { landResolvers } from "./land";

export const resolvers = mergeResolvers([subscribersResolvers, landResolvers]);
