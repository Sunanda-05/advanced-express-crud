import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["read", "edit"],
          default: "read",
        },
      },
    ],
    linkToken: {
      type: String,
      unique: true,
      sparse: true, // allows documents without this field
    },
    visibility: {
      type: String,
      enum: ["private", "public", "link"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);


// For full-text search
documentSchema.index({ title: "text", content: "text" });
documentSchema.index({ owner: 1, _id: 1 });  // For the owner-docId pair
documentSchema.index({ "sharedWith.user": 1, _id: 1 });  // For shared documents
documentSchema.index({ linkToken: 1, visibility: 1 });  // For link-shared documents

export default mongoose.model("Document", documentSchema);
