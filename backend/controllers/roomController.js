import roomModel from "../models/roomModel.js";
import userModel from "../models/user.js";

export const createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newRoom = new roomModel({
      name,
      description,
      admin: userId,
      members: [userId],
    });
    await newRoom.save();

    res.status(201).json({ message: "Room created", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Failed to create room", error });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rooms = await roomModel
      .find({ members: userId })
      .populate("admin", "name email");

    res.status(200).json({ userId, userName: user.name, rooms });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomModel.find().populate("admin", "name email image");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all rooms", error });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name; // Assuming user name is stored in req.user
    const { roomId } = req.params;

    // Find the room by its ID
    const room = await roomModel.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Check if the user is already in the room
    if (room.members.includes(userId)) {
      return res.status(400).json({ message: "You are already in this room" });
    }

    // Add the user to the room's members
    room.members.push(userId);
    await room.save();

    // Return a response with the success message, room details, userId, userName, and roomName
    res.status(200).json({
      message: "Successfully joined the room",
      roomId,
      roomName: room.name, // Include the room name here
      userId,
      userName,
    });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ message: "Failed to join room", error });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    const room = await roomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this room" });
    }

    // Remove the user from the members array
    room.members = room.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    // If the user is the admin, reassign the admin role
    if (room.admin.toString() === userId.toString()) {
      if (room.members.length > 0) {
        room.admin = room.members[0];
      } else {
        await room.remove();
        return res.status(200).json({ message: "Room deleted as admin left" });
      }
    }

    await room.save();

    res.status(200).json({ message: "Successfully left the room", room });
  } catch (error) {
    console.error("Leave room error:", error);
    res.status(500).json({ message: "Failed to leave room", error });
  }
};
