import Task from "@/models/Task";

export const taskResolvers = {
  Query: {
    getTasks: async (_, { userId }) => {
      return await Task.find({ userId });
    },
    getTotalXpReward: async (_, { landId }) => {
      const taskIds = [
        "DISCORD_FARMER_ROLE",
        "TWITTER_FOLLOW",
        "TELEGRAM_JOIN",
        "CLAIM_GRASS_LAND_1",
        "CLAIM_TREE_1,",
      ];

      const tasks = await Task.find({
        landId,
        taskId: { $in: taskIds }, // taskId bu dizide varsa seç
      });

      return tasks.reduce((total, task) => total + task.xpReward, 0);
    },
    getSpecificTask: async (_, { landId, taskId }) => {
      return await Task.findOne({ landId, taskId });
    },
  },
  Mutation: {
    addTask: async (_, { userId, landId, taskId, xpReward }) => {
      console.log("ADD TASK:", userId, landId, taskId, xpReward);
      const existingTask = await Task.findOne({ userId, landId, taskId });
      if (existingTask) {
        return existingTask; // Zaten var olan görevi döndür
      }
      const newTask = new Task({ userId, landId, taskId, xpReward });
      return await newTask.save();
    },
  },
};
