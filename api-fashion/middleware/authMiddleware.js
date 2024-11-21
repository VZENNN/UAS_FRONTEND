const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ success: false, message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid token" });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ success: false, message: "Access denied" });
    next();
};

module.exports = { authenticate, authorizeAdmin };