import express from 'express';
import { createDocument, createDocumentForRoom, getDocuments, getDocument, deleteDocument,updateDocument } from '../controllers/document-controller';

const router = express.Router();

// @route POST /api/v1/document/create
router.route("/create").post(createDocument);

// @route POST /api/v1/document/create/:id
router.route("/create/:id").post(createDocumentForRoom);

// @route GET /api/v1/document/get
router.route("/get").get(getDocuments);

// @route GET /api/v1/document/get/:id
router.route("/get/:id").get(getDocument);

// @route DELETE /api/v1/document/delete/:id
router.route("/delete/:id").delete(deleteDocument);

// @route PUT /api/v1/document/update/:id
router.route("/update/:id").put(updateDocument);

export default router;