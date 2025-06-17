import mongoose from "mongoose";

const sharedWithSchema = new mongoose.Schema(
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
  { _id: false } // Optional: avoids creating _id for each subdoc
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      default: {},
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [sharedWithSchema],
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
documentSchema.index({ title: "text" });
documentSchema.index({ owner: 1, _id: 1 }); // For the owner-docId pair
documentSchema.index({ "sharedWith.user": 1, _id: 1 }); // For shared documents
documentSchema.index({ linkToken: 1, visibility: 1 }); // For link-shared documents
documentSchema.index({ tags: 1 });
documentSchema.index({ tags: 1, owner: 1 });

export default mongoose.model("Document", documentSchema);
