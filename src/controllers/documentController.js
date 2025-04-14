import {
  updatePatchDocument,
  updatePutDocument,
  shareDocument,
  getAllDocuments,
  createDocument,
  getDocumentById,
  deleteDocument,
  getDocumentByLinkToken,
  unshareDocument,
  regenerateLinkToken,
  disableLinkToken,
} from "../services/documentService.js";

export const createDocumentHandler = async (req, res, next) => {
  try {
    const document = await createDocument(req.body, req.user.id);
    res.status(201).json(document);
  } catch (err) {
    next(err);
  }
};

export const getSingleDocumentHandler = async (req, res, next) => {
  try {
    const document = await getDocumentById(req.user.id, req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(document);
  } catch (err) {
    next(err);
  }
};

export const getDocumentsHandler = async (req, res, next) => {
  try {
    const documents = await getAllDocuments(req.user.id, req.query);
    res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
};

export const updateDocumentHandler = async (req, res, next) => {
  try {
    const updated =
      req.method == "PATCH"
        ? await updatePatchDocument(req.params.id, req.body, req.user.id)
        : await updatePutDocument(req.params.id, req.body, req.user.id);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const shareDocumentHandler = async (req, res, next) => {
  try {
    const updated = await shareDocument(
      req.params.id,
      req.body.userId,
      req.user.id
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const unshareDocumentHandler = async (req, res, next) => {
  try {
    const updated = await unshareDocument(
      req.params.id,
      req.body.userId,
      req.user.id
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const regenerateTokenHandler = async (req, res, next) => {
  try {
    const updated = await regenerateLinkToken(
      req.params.id,
      req.user.id
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const disableTokenHandler = async (req, res, next) => {
  try {
    const updated = await disableLinkToken(
      req.params.id,
      req.user.id
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteDocumentHandler = async (req, res, next) => {
  try {
    const deleted = await deleteDocument(req.params.id, req.user.id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};

export const getDocumentByLinkTokenHandler = async (req, res, next) => {
  try {
    const document = await getDocumentByLinkToken(req.params.linkToken);
    res.status(200).json(document);
  } catch (err) {
    next(err);
  }
};
