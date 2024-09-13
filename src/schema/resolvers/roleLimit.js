import RoleLimit from "@/models/RoleLimit";
import {
  checkUserRole,
  addRoleToDiscordUser,
  checkUserInGuild,
} from "@/lib/discordApi";

export const roleLimitResolvers = {
  Query: {
    getRoleLimit: async (_, { roleId }) => {
      return await RoleLimit.findOne({ roleId });
    },
    checkUserRole: async (_, { userId, roleId }) => {
      return await checkUserRole(userId, roleId);
    },
    checkUserInGuild: async (_, { userId }) => {
      return await checkUserInGuild(userId);
    },
  },

  Mutation: {
    createOrUpdateRoleLimit: async (_, { roleId, maxLimit }) => {
      return await RoleLimit.findOneAndUpdate(
        { roleId },
        { $set: { maxLimit } },
        { new: true, upsert: true }
      );
    },
    addRoleToUser: async (_, { userId, roleId }) => {
      const roleLimit = await RoleLimit.findOne({ roleId });

      if (roleLimit && roleLimit.currentCount >= roleLimit.maxLimit) {
        return { success: false, message: "Role limit reached" };
      }

      try {
        console.log(`Attempting to add role ${roleId} to user ${userId}`);
        await addRoleToDiscordUser(userId, roleId);

        if (roleLimit) {
          roleLimit.currentCount += 1;
          await roleLimit.save();
        }

        console.log(`Role ${roleId} successfully added to user ${userId}`);
        return { success: true, message: "Role added successfully" };
      } catch (error) {
        console.error("Error in addRoleToUser resolver:", error);
        return {
          success: false,
          message: `Failed to add role: ${error.message}`,
        };
      }
    },
  },
};
