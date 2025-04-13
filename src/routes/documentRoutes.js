import { Router } from "express";
import {
  createDocumentHandler,
  deleteDocumentHandler,
  getDocumentsHandler,
  getSingleDocumentHandler,
  updateDocumentHandler,
  shareDocumentHandler,
  getDocumentByLinkTokenHandler,
} from "../controllers/documentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, createDocumentHandler);
router.get("/", authMiddleware, getDocumentsHandler);
router.get("/:id", authMiddleware, getSingleDocumentHandler);
router.patch("/:id", authMiddleware, updateDocumentHandler);
router.put("/:id", authMiddleware, updateDocumentHandler);
router.delete("/:id", authMiddleware, deleteDocumentHandler);
router.patch("/:id/share", authMiddleware, shareDocumentHandler);
router.get("/access/:linkToken", getDocumentByLinkTokenHandler);

export default router;
