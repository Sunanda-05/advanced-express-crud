import Tag from "../models/tagModel.js";
import ApiError from "../utils/ApiError.js";

export const getTagIdsFromNames = async (tagNames) => {
  if (!Array.isArray(tagNames)) {
    throw new ApiError(400, "Tags should be an array of strings");
  }

  const tagDocuments = await Promise.all(
    tagNames.map(async (tag) => {
      let tagDoc = await Tag.findOne({ name: tag.toLowerCase() });
      if (!tagDoc) {
        tagDoc = await Tag.create({ name: tag.toLowerCase() });
      }
      return tagDoc._id;
    })
  );

  return tagDocuments;
};
