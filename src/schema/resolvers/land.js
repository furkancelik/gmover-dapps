import Land from "@/models/Land";

export const landResolvers = {
  Query: {
    getLand: async (_, { walletAddress }) => {
      return await Land.findOne({ walletAddress });
    },
    getAllLands: async () => {
      return await Land.find();
    },
  },

  Mutation: {
    createLand: async (_, { input }) => {
      // 'upsert' parametresi ile güncelleme yoksa yeni kayıt oluşturma işlemi yapılır
      const updatedLand = await Land.findOneAndUpdate(
        { walletAddress: input.walletAddress }, // Wallet address ile ara
        { $set: input }, // Input içeriğini güncelle
        { new: true, upsert: true, setDefaultsOnInsert: true } // Bulunamazsa yeni kayıt oluştur
      );

      return {
        ...updatedLand.toObject(), // Mevcut veri
        id: updatedLand._id, // ID'yi döndür
      };
    },

    updateLand: async (_, { walletAddress, input }) => {
      const updatedLand = await Land.findOneAndUpdate(
        { walletAddress },
        input,
        { new: true }
      );
      if (!updatedLand) {
        throw new Error("Land not found");
      }
      return updatedLand;
    },

    claimResources: async (_, { walletAddress }) => {
      const land = await Land.findOne({ walletAddress });
      if (!land) {
        throw new Error("Land not found");
      }

      const now = new Date();
      const lastClaim = new Date(land.lastResourceClaimTime || 0);
      const hoursSinceLastClaim = (now - lastClaim) / (1000 * 60 * 60);

      // Check if the user is allowed to claim resources (once every 24 hours)
      if (hoursSinceLastClaim < 24) {
        throw new Error("You can only claim resources once every 24 hours.");
      }

      // Update the resources and lastResourceClaimTime
      land.resources += 1;
      land.lastResourceClaimTime = now;
      return await land.save();
    },
  },
};
