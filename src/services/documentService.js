import Doc from "../models/documentModel.js";
import Tag from "../models/tagModel.js";
import ApiError from "../utils/ApiError.js";
import generateLinkToken from "../utils/linkToken.js";
import { getTagIdsFromNames } from "./tagServices.js";

export const createDocument = async (data, userId) => {
  try {
    var linkToken;
    if (data.visibility === "link") {
      linkToken = generateLinkToken();
    }

    const tagDocuments = data.tags ? await getTagIdsFromNames(data.tags) : [];

    const document = await Doc.create({
      ...data,
      linkToken,
      owner: userId,
      tags: tagDocuments,
    });
    return document;
  } catch (error) {
    throw new Error("Error creating document");
  }
};

export const getAllDocuments = async (userId, query) => {
  try {
    const {
      tags,
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const skip = (page - 1) * limit;
    const accessFilter = {
      $or: [{ owner: userId }, { sharedWith: { user: userId } }],
    };

    if (search) {
      accessFilter.$text = { $search: search };
    }

    if (tags) {
      const tagArray = tags.split(',');
      const tagObjects = await Tag.find({ name: { $in: tagArray } });
      const tagIds = tagObjects.map((tag) => tag._id);
      accessFilter.tags = { $in: tagIds };
    }


    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const totalDocs = await Doc.countDocuments(accessFilter);

    // Fetch paginated docs
    const documents = await Doc.find(accessFilter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("tags");

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      documents,
      meta: {
        totalDocs,
        totalPages,
        currentPage: Number(page),
        hasNext: page < totalPages,
      },
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error retrieving documents");
  }
};

export const getDocumentById = async (userId, id) => {
  try {
    const document = await Doc.findOne({
      $or: [{ owner: userId }, { "sharedWith.user": userId }],
      _id: id,
    }).populate("tags");;

    return document;
  } catch (error) {
    console.log(error);
    throw new Error("Error retrieving documents");
  }
};

export const updatePutDocument = async (id, data, userId) => {
  const document = await Doc.findById(id);
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== userId.toString()) {
    throw new ApiError(401, "Unauthorized");
  }

  document.title = data.title ?? "";
  document.content = data.content ?? "";
  document.sharedWith = data.sharedWith ?? [];
  if (
    data.visibility === "link" &&
    document.visibility !== "link" &&
    !document.linkToken
  ) {
    document.linkToken = generateLinkToken();
  } else if (document.visibility === "link" && data.visibility !== "link") {
    document.linkToken = null;
  }

  if (data.tags) {
    const tagIds = await getTagIdsFromNames(data.tags);
    document.tags = tagIds;
  }

  document.visibility = data.visibility ?? "private";
  await document.save();
  return document;
};

export const updatePatchDocument = async (id, data, userId) => {
  const document = await Doc.findById(id);
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== userId.toString()) {
    throw new ApiError(401, "Unauthorized");
  }

  if (
    data.visibility === "link" &&
    document.visibility !== "link" &&
    !document.linkToken
  ) {
    document.linkToken = generateLinkToken();
  } else if (document.visibility === "link" && data.visibility !== "link") {
    document.linkToken = null;
  }

  if (data.tags) {
    const tagIds = await getTagIdsFromNames(data.tags);
    document.tags = [...new Set([...document.tags, ...tagIds])];
  }

  Object.keys(data).forEach((key) => {
    if (key != "tags") {
      document[key] = data[key];
    }
  });

  await document.save();
  return document;
};

export const deleteDocument = async (id, userId) => {
  const deletedDoc = await Doc.findOneAndDelete({
    _id: id,
    owner: userId,
  });

  if (!deletedDoc) {
    throw new ApiError(404, "Not authorized or document not found");
  }
  return deletedDoc;
};

export const shareDocument = async (id, targetUserId, ownerId) => {
  const document = await Doc.findById(id);
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== ownerId.toString()) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!document.sharedWith.includes(targetUserId)) {
    document.sharedWith.push(targetUserId);
    await document.save();
  }

  return document;
};

export const unshareDocument = async (id, targetUserId, ownerId) => {
  const document = await Doc.findById(id);
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== ownerId.toString()) {
    throw new ApiError(401, "Unauthorized");
  }

  if (document.sharedWith.includes(targetUserId)) {
    return await Doc.findByIdAndUpdate(
      id,
      { $pull: { sharedWith: targetUserId } },
      { new: true }
    );
  }

  return document;
};

export const getDocumentByLinkToken = async (linkToken) => {
  const document = await Doc.findOne({ linkToken, visibility: "link" });
  if (!document) throw new ApiError(404, "Document not found");
  return document;
};

export const regenerateLinkToken = async (id, ownerId) => {
  const document = await Doc.findOne({
    _id: id,
    owner: ownerId,
  });

  if (!document) throw new ApiError(404, "Document not found");
  if (document.visibility !== "link")
    throw new ApiError(400, "Invalid visibility");

  return await Doc.findByIdAndUpdate(
    id,
    { linkToken: generateLinkToken() },
    { new: true }
  );
};

export const disableLinkToken = async (id, ownerId) => {
  const document = await Doc.findOne({
    _id: id,
    owner: ownerId,
  });

  if (!document) throw new ApiError(404, "Document not found");
  if (document.visibility !== "link")
    throw new ApiError(400, "Invalid visibility");

  return await Doc.findOneAndUpdate(
    { _id: id, linkToken: { $exists: true } },
    { $set: { linkToken: null, visibility: "private" } },
    { new: true }
  );
};
