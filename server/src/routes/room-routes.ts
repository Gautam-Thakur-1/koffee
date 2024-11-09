import express from 'express';
import { isOauth ,authorizeRoles} from '../middleweres/isOauth';
import { createRoom, getRooms, getRoom, deleteRoom, approveUser,joinRoom ,leaveRoom,rejectUser,sendApproval } from '../controllers/room-controller';

const router = express.Router();

// @route POST /api/v1/room/create
router.route("/create").post(isOauth,createRoom);

// @route GET /api/v1/room/get
router.route("/get").get(isOauth,authorizeRoles("user"),getRooms);

// @route GET /api/v1/room/get/:id
router.route("/get/:id").get(getRoom);

// @route DELETE /api/v1/room/delete/:id
router.route("/delete/:id").delete(isOauth,deleteRoom);

// @route PUT /api/v1/room/approve/:id
router.route("/approve/:id").put(isOauth,approveUser);

// @route PUT /api/v1/room/reject/:id
router.route("/reject/:id").put(isOauth,rejectUser);

// @route PUT /api/v1/room/join/:id
router.route("/join/:id").put(isOauth,joinRoom);

// @route PUT /api/v1/room/leave/:id
router.route("/leave/:id").put(isOauth,leaveRoom);

// @route PUT /api/v1/room/send-approval/:id
router.route("/send-approval/:id").put(isOauth,sendApproval);

export default router;