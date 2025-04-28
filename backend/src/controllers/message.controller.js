import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: otherId } = req.params; // otherId is the id of the user who you are chatting with
        const id = req.user._id; // my id

        const messages = await Message.find({
            $or: [
                {senderId: id, receiverId: otherId},
                {senderId: otherId, receiverId: id} 
            ]
        })
        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id: otherId } = req.params; // otherId is the id of the user who you are chatting with
        const id = req.user._id; // my id
        const { text, image } = req.body;
        if (!image && !text) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        let imageUrl = undefined;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: id,
            receiverId: otherId,
            text,
            image: imageUrl
        });

        const message = await newMessage.save();

        const receiverSocketId = getReceiverSocketId(otherId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(message);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}