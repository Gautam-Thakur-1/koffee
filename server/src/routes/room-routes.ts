import express from 'express';
import { createRoom, getRooms, getRoom, deleteRoom, approveUser,joinRoom ,leaveRoom,rejectUser,sendApproval } from '../controllers/room-controller';

const router = express.Router();

// @route POST /api/v1/room/create
router.route("/create").post(createRoom);

// @route GET /api/v1/room/get
router.route("/get").get(getRooms);

// @route GET /api/v1/room/get/:id
router.route("/get/:id").get(getRoom);

// @route DELETE /api/v1/room/delete/:id
router.route("/delete/:id").delete(deleteRoom);

// @route PUT /api/v1/room/approve/:id
router.route("/approve/:id").put(approveUser);

// @route PUT /api/v1/room/reject/:id
router.route("/reject/:id").put(rejectUser);

// @route PUT /api/v1/room/join/:id
router.route("/join/:id").put(joinRoom);

// @route PUT /api/v1/room/leave/:id
router.route("/leave/:id").put(leaveRoom);

// @route PUT /api/v1/room/send-approval/:id
router.route("/send-approval/:id").put(sendApproval);

export default router;