import Subscribers from "@/models/Subscribers";

export const subscribersResolvers = {
  Mutation: {
    addSubscribers: async (_, { input }, {}) => {
      return await Subscribers.create(input);
    },
  },
};
