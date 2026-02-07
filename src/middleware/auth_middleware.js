import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Missing authorization header',
        })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Invalid authorization header',
        })
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        })
    }
}