import mongoose from "mongoose";

const landSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true, // Her kullanıcı için benzersiz cüzdan adresi
    },
    gridState: {
      type: [[String]], // 2D Array (7x7 grid)
      default: Array(7)
        .fill(null)
        .map(() => Array(7).fill("dry")), // Başlangıç değeri: tüm hücreler 'dry'
    },
    resources: {
      type: Number,
      default: 0, // Başlangıçta 0 kaynak
    },
    lastResourceClaimTime: {
      type: Date,
      default: null, // Kaynak henüz toplanmadıysa null
    },
  },
  { timestamps: true } // createdAt ve updatedAt için otomatik timestamp
);

export default mongoose.models.Land || mongoose.model("Land", landSchema);
