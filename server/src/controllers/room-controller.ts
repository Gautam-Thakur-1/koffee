import User from "../model/User";
import Room from "../model/Room";
import { Request, Response } from "express";
import { isOauth } from "../middleweres/isOauth";

// @route POST /api/v1/room/create
// @desc Create a room

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, members, objective,sendApproval,uniqueId,adminId } = req.body;
        if (!name || !members || !objective) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        const room = await Room.create({
            name,
            members,
            objective,
            sendApproval,
            adminId: req.body.userId,
            uniqueId
        });
        return res.status(201).json({
            message: "Room created successfully",
            data: room
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}


// @route GET /api/v1/room/get
// @desc Get all rooms

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find().populate("members");
        return res.status(200).json({
            data: rooms
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}

// @route GET /api/v1/room/get/:id
// @desc Get a room by id

export const getRoom = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id).populate("members");
        return res.status(200).json({
            data: room
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}

// @route post /api/v1/room/leave-room/:id
// @desc Leave a room

export const leaveRoom = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(400).json({ message: "Room not found" });
        }
        room.members = room.members.filter((member: any) => member.toString() !== req.body.userId);
        await room.save();
        return res.status(200).json({
            message: "You have left the room"
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}


// @route post /api/v1/room/delete/:id
// @desc Delete a room

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(400).json({ message: "Room not found" });
        }
        if(room?.adminId?.toString() !== req.body.userId){
            return res.status(400).json({ message: "You are not authorized to delete this room" });
        }
        await room.deleteOne();
        return res.status(200).json({
            message: "Room deleted successfully"
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}

// @route post /api/v1/room/approved/:id
// @desc send approval to join room initial in waiting list

export const sendApproval = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(400).json({ message: "Room not found" });
        }
        if(room?.adminId?.toString() !== req.body.userId){
            return res.status(400).json({ message: "You are not authorized to approve this room" });
        }
        if(room.waitingMembers.includes(req.body.userId)){
            return res.status(400).json({ message: "You have already sent approval to this user" });
        }
        if(room.sendApproval){
            room.waitingMembers.push(req.body.userId);
            await room.save();
            return res.status(200).json({
                message: "Approval sent successfully"
            });
        }
        return res.status(400).json({ message: "Approval not sent" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}

// @route post /api/v1/room/approve/:id
// @desc approve user to join room by admin

export const approveUser = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(400).json({ message: "Room not found" });
        }
        if(room?.adminId?.toString() !== req.body.userId){
            return res.status(400).json({ message: "You are not authorized to approve this room" });
        }
        if(room.waitingMembers.includes(req.body.userId)){
            room.members.push(req.body.userId);
            room.waitingMembers = room.waitingMembers.filter((member: any) => member.toString() !== req.body.userId);
            await room.save();
            return res.status(200).json({
                message: "User approved successfully"
            });
        }
        return res.status(400).json({ message: "User not found in waiting list" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}

// @route post /api/v1/room/reject/:id
// @desc reject user to join room by admin send him to suspended list

export const rejectUser = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(400).json({ message: "Room not found" });
        }
        if(room?.adminId?.toString() !== req.body.userId){
            return res.status(400).json({ message: "You are not authorized to reject this room" });
        }
        if(room.waitingMembers.includes(req.body.userId)){
            room.suspendedMembers.push(req.body.userId);
            room.waitingMembers = room.waitingMembers.filter((member: any) => member.toString() !== req.body.userId);
            await room.save();
            return res.status(200).json({
                message: "User rejected successfully"
            });
        }
        return res.status(400).json({ message: "User not found in waiting list" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}

// @route post /api/v1/room/join/:id
// @desc join a room

export const joinRoom = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(400).json({ message: "Room not found" });
        }
        if(room.members.includes(req.body.userId)){
            return res.status(400).json({ message: "You are already a member of this room" });
        }
        if(room.suspendedMembers.includes(req.body.userId)){
            return res.status(400).json({ message: "You are suspended from this room" });
        }
        if(!room.sendApproval){
            room.members.push(req.body.userId);
            await room.save();
            return res.status(200).json({
                message: "You have joined the room"
            });
        }   
        return res.status(400).json({ message: "You need approval to join this room" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        
    }
}



