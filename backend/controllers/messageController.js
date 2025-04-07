import messageModel from "../models/messageModel.js";

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await messageModel
      .find({ roomId })
      .populate("user", "name");

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    console.log("req body:", req.body);

    const newMessage = new messageModel({
      roomId,
      user: userId,
      message,
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message", error });
  }
};
