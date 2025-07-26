import Doc from "../models/documentModel.js";
import ApiError from "../utils/ApiError.js";
import { hasEditAccess } from "../utils/editAccess.js";
import generateLinkToken from "../utils/linkToken.js";

export const createDocument = async (data, userId) => {
  try {
    var linkToken;
    if (data.visibility === "link") {
      linkToken = generateLinkToken();
    }

    const document = await Doc.create({
      ...data,
      linkToken,
      owner: userId,
      tags: data.addTags ? Array.from(new Set(data.addTags)) : [],
    });
    return document;
  } catch (error) {
    throw new Error("Error creating document");
  }
};

export const getAllDocuments = async (userId, query) => {
  try {
    const visibilityMap = {
      private: {
        owner: userId,
        visibility: "private",
      },
      shared: {
        "sharedWith.user": userId,
        owner: { $ne: userId },
      },
      all: {
        $or: [{ owner: userId }, { "sharedWith.user": userId }],
      },
    };
    const {
      tags,
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      isStarred = false,
      visibilityType = "all",
    } = query;

    const skip = (page - 1) * limit;
    const accessFilter = structuredClone(
      visibilityMap[visibilityType] || visibilityMap.all
    );
    // $or: [{ owner: userId }, { sharedWith: { user: userId } }],

    if (search) {
      accessFilter.$text = { $search: search };
    }

    if (tags) {
      const tagArray = tags.split(",");
      accessFilter.tags = { $in: tagArray };
    }

    if (isStarred) {
      accessFilter.isStarred = isStarred;
    }

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const totalDocs = await Doc.countDocuments(accessFilter);

    console.log(accessFilter)
    const documents = await Doc.find(accessFilter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate({
      path: "sharedWith.user",
      select: "_id name email",
    });
    
    // console.log(documents)
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
    }).populate({
      path: "sharedWith.user",
      model: "User",
      select: "_id name email",
    });

    return document;
  } catch (error) {
    console.log(error);
    throw new Error("Error retrieving documents");
  }
};

export const updatePutDocument = async (id, data, userId) => {
  const document = await Doc.findById(id).populate({
    path: "sharedWith.user",
    select: "_id name email",
  });
  if (!document) throw new ApiError(404, "Document not found");

  if (!hasEditAccess(document, userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  document.title = data.title ?? "";
  document.content = data.content ?? {};
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

  document.tags = data.tags ? Array.from(new Set(data.tags)) : [];

  document.visibility = data.visibility ?? "private";
  await document.save();
  return document;
};

export const updatePatchDocument = async (id, data, userId) => {
  const document = await Doc.findById(id).populate({
    path: "sharedWith.user",
    select: "_id name email",
  });
  if (!document) throw new ApiError(404, "Document not found");

  if (!hasEditAccess(document, userId)) {
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

  if (data.addTags) {
    document.tags = Array.from(new Set([...document.tags, ...data.addTags]));
  }

  if (data.removeTags) {
    document.tags = document.tags.filter(
      (tag) => !data.removeTags.includes(tag)
    );
  }

  Object.keys(data).forEach((key) => {
    if (key !== "tags" && key !== "linkToken") {
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

export const shareDocument = async (
  id,
  targetUserId,
  newPermission,
  ownerId
) => {
  const document = await Doc.findById(id).populate({
    path: "sharedWith.user",
    select: "_id name email",
  });
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== ownerId.toString()) {
    throw new ApiError(401, "Unauthorized");
  }

  console.log(newPermission);
  const existing = document.sharedWith.find(
    (entry) => entry.user?._id.toString() === targetUserId.toString()
  );

  console.log({ existing }, document.sharedWith);
  if (!existing) {
    document.sharedWith.push({ user: targetUserId, permission: newPermission });
  } else if (existing.permission !== newPermission) {
    existing.permission = newPermission;
  }

  document.save();

  return document;
};

export const unshareDocument = async (id, targetUserId, ownerId) => {
  const document = await Doc.findById(id).populate("tags").populate({
    path: "sharedWith.user",
    select: "_id name email",
  });
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== ownerId.toString()) {
    throw new ApiError(401, "Unauthorized");
  }

  await Doc.findByIdAndUpdate(
    id,
    { $pull: { sharedWith: { user: targetUserId } } },
    { new: true }
  );

  return document;
};

export const getDocumentByLinkToken = async (linkToken) => {
  const document = await Doc.findOne({
    linkToken,
    visibility: "link",
  }).populate({
    path: "sharedWith.user",
    select: "_id name email",
  });

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
