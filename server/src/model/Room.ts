import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    waitingMembers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" }, 
    suspendedMembers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" }, 
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    objective: { type: String, required: true },
    messages: { type: [mongoose.Schema.Types.ObjectId], ref: "Message" },
    uniqueId: { type: String, required: true, unique: true },
    isApproved: { type: Boolean, default: false },
    sendApproval: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Room = mongoose.model("Room", RoomSchema);
export default Room;