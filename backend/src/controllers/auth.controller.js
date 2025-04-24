import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if(!profilePic) {
            return res.status(400).json({ message: "Profile picture is required." });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {profilePic: uploadResponse.secure_url}, {new: true});

        return res.status(200).json({ updatedUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." }); 
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." }); 
    }
}