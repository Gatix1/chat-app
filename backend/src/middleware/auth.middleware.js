import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// middleware for checking authentication
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Not authorized." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Not authorized." });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};