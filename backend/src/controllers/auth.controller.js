import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        // Verifying password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }
        // Verifying uniquiness of the email and username
        const user_by_email = await User.findOne({ email });
        if (user_by_email) {
            return res.status(400).json({ message: "Email already registered." });
        }
        const user_by_username = await User.findOne({ username });
        if (user_by_username) {
            return res.status(400).json({ message: "Username already exists." });
        }
        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);
        // Creating user
        const user = new User({
            email,
            username,
            password: hashed_password,
        });
        // Saving the user
        generateToken(user._id, res);
        const saved_user = await user.save();
        
        res.status(201).json({
            _id: saved_user._id,
            email: saved_user.email,
            username: saved_user.username,
            profilePic: saved_user.profilePic
        });
    } catch (error) {
        res.send(400, { message: error.message });
    }
}

export const login = (req, res) => {
    res.send("signup route");
}

export const logout = (req, res) => {
    res.send("signup route");
}