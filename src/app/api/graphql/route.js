import { createYoga } from "graphql-yoga";
import { schema } from "@/schema";

import dbConnect from "@/lib/db";

const { handleRequest } = createYoga({
  schema: schema,
  context: async ({ request }) => {
    await dbConnect();
    return {};
  },

  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
