import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index for the expirationDate field
refreshTokenSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.methods.isValid = function () {
  return this.expirationDate > new Date();
};

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;
