import { Router } from "express";
import {
  createDocumentHandler,
  deleteDocumentHandler,
  getDocumentsHandler,
  getSingleDocumentHandler,
  updateDocumentHandler,
  shareDocumentHandler,
  getDocumentByLinkTokenHandler,
  unshareDocumentHandler,
  regenerateTokenHandler,
  disableTokenHandler,
} from "../controllers/documentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validateDocument } from "../middlewares/validateDocMiddleware.js";

const router = Router({ mergeParams: true });

router.get("/", authMiddleware, getDocumentsHandler);
router.post("/", authMiddleware, validateDocument, createDocumentHandler);

router.get("/:id", authMiddleware, getSingleDocumentHandler);
router.patch("/:id", authMiddleware, updateDocumentHandler);
router.put("/:id", authMiddleware, updateDocumentHandler);
router.delete("/:id", authMiddleware, deleteDocumentHandler);

router.patch("/:id/share", authMiddleware, shareDocumentHandler);
router.patch("/:id/unshare", authMiddleware, unshareDocumentHandler);

router.patch("/:id/regenerate-link", authMiddleware, regenerateTokenHandler);
router.patch("/:id/disable-link", authMiddleware, disableTokenHandler);

router.get("/access/:linkToken", getDocumentByLinkTokenHandler);

export default router;
